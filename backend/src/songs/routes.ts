import { Router } from "express";
import mongoose from "mongoose";
import type { FilterQuery } from "mongoose";
import { toSongResponse } from "./mapper.js";
import { SONG_GENRES, Song, type SongAttrs, type SongDocument, type SongGenre } from "./song.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;
const SONG_FIELDS = ["title", "artist", "album", "genre", "artworkUrl"] as const;
const REQUIRED_SONG_FIELDS = ["title", "artist", "album", "genre"] as const;
const SONG_FIELD_LIMITS = {
  title: 120,
  artist: 120,
  album: 120,
  genre: 80,
  artworkUrl: 2048
} as const;

const parsePositiveInt = (value: unknown, fallback: number) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const getTrimmedQueryValue = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeGroupName = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

interface ValidationResult {
  attrs?: SongAttrs;
  errors?: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSongGenre = (value: string): value is SongGenre =>
  SONG_GENRES.some((genre) => genre === value);

const validateSongPayload = (payload: unknown): ValidationResult => {
  if (!isRecord(payload)) {
    return { errors: ["Request body must be an object."] };
  }

  const allowedFields = new Set<string>(SONG_FIELDS);
  const unknownFields = Object.keys(payload).filter((field) => !allowedFields.has(field));
  const errors = unknownFields.map((field) => `${field} is not a supported Song field.`);
  const attrs: Partial<SongAttrs> = {};

  for (const field of REQUIRED_SONG_FIELDS) {
    const value = payload[field];

    if (typeof value !== "string" || !value.trim()) {
      errors.push(`${field} is required.`);
      continue;
    }

    const trimmed = value.trim();

    if (trimmed.length > SONG_FIELD_LIMITS[field]) {
      errors.push(`${field} must be ${SONG_FIELD_LIMITS[field]} characters or fewer.`);
      continue;
    }

    if (field === "genre") {
      if (!isSongGenre(trimmed)) {
        errors.push(`genre must be one of: ${SONG_GENRES.join(", ")}.`);
        continue;
      }

      attrs.genre = trimmed;
    } else {
      attrs[field] = trimmed;
    }
  }

  if (Object.hasOwn(payload, "artworkUrl")) {
    const artworkUrl = payload.artworkUrl;

    if (artworkUrl === null || artworkUrl === undefined || artworkUrl === "") {
      attrs.artworkUrl = null;
    } else if (typeof artworkUrl !== "string") {
      errors.push("artworkUrl must be a string or null.");
    } else {
      const trimmedArtworkUrl = artworkUrl.trim();

      if (!trimmedArtworkUrl) {
        attrs.artworkUrl = null;
      } else if (trimmedArtworkUrl.length > SONG_FIELD_LIMITS.artworkUrl) {
        errors.push(`artworkUrl must be ${SONG_FIELD_LIMITS.artworkUrl} characters or fewer.`);
      } else {
        attrs.artworkUrl = trimmedArtworkUrl;
      }
    }
  } else {
    attrs.artworkUrl = null;
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { attrs: attrs as SongAttrs };
};

const isDuplicateKeyError = (error: unknown) =>
  isRecord(error) && error.code === 11000;

const isValidSongId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const buildSongFilter = (query: unknown, genre: unknown): FilterQuery<SongDocument> => {
  const searchTerm = getTrimmedQueryValue(query);
  const genreFilter = getTrimmedQueryValue(genre);
  const clauses: FilterQuery<SongDocument>[] = [];

  if (searchTerm) {
    const searchRegex = new RegExp(escapeRegex(searchTerm), "i");
    clauses.push({
      $or: [
        { title: searchRegex },
        { artist: searchRegex },
        { album: searchRegex },
        { genre: searchRegex }
      ]
    });
  }

  if (genreFilter) {
    clauses.push({ genre: new RegExp(`^${escapeRegex(genreFilter)}$`, "i") });
  }

  if (clauses.length === 0) {
    return {};
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return { $and: clauses };
};

export const createSongRouter = () => {
  const router = Router();

  router.get("/stats", async (_request, response, next) => {
    try {
      const [totalSongs, artists, albums, genres, songsByGenre, artistsSummary, songsByAlbum] =
        await Promise.all([
          Song.countDocuments({}).exec(),
          Song.distinct("artist").exec(),
          Song.distinct("album").exec(),
          Song.distinct("genre").exec(),
          Song.aggregate<{ _id: string | null; songs: number }>([
            { $group: { _id: "$genre", songs: { $sum: 1 } } },
            { $sort: { songs: -1, _id: 1 } }
          ]).exec(),
          Song.aggregate<{ _id: string | null; songs: number; albums: number }>([
            {
              $group: {
                _id: "$artist",
                songs: { $sum: 1 },
                albumNames: { $addToSet: "$album" }
              }
            },
            { $project: { songs: 1, albums: { $size: "$albumNames" } } },
            { $sort: { songs: -1, _id: 1 } }
          ]).exec(),
          Song.aggregate<{ _id: string | null; songs: number }>([
            { $group: { _id: "$album", songs: { $sum: 1 } } },
            { $sort: { songs: -1, _id: 1 } }
          ]).exec()
        ]);

      response.status(200).json({
        totals: {
          songs: totalSongs,
          artists: artists.length,
          albums: albums.length,
          genres: genres.length
        },
        songsByGenre: songsByGenre.map((item) => ({
          genre: normalizeGroupName(item._id, "Unknown genre"),
          songs: item.songs
        })),
        artists: artistsSummary.map((item) => ({
          artist: normalizeGroupName(item._id, "Unknown artist"),
          songs: item.songs,
          albums: item.albums
        })),
        songsByAlbum: songsByAlbum.map((item) => ({
          album: normalizeGroupName(item._id, "Unknown album"),
          songs: item.songs
        }))
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/", async (request, response, next) => {
    try {
      const page = parsePositiveInt(request.query.page, DEFAULT_PAGE);
      const requestedLimit = parsePositiveInt(request.query.limit, DEFAULT_LIMIT);
      const limit = Math.min(requestedLimit, MAX_LIMIT);
      const skip = (page - 1) * limit;
      const filter = buildSongFilter(request.query.q, request.query.genre);

      const [songs, totalItems, genres] = await Promise.all([
        Song.find(filter).sort({ artist: 1, album: 1, title: 1 }).skip(skip).limit(limit).exec(),
        Song.countDocuments(filter).exec(),
        Song.distinct("genre").exec()
      ]);

      response.status(200).json({
        items: songs.map(toSongResponse),
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        genres: genres.sort((first, second) => first.localeCompare(second))
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      const result = validateSongPayload(request.body);

      if (result.errors) {
        response.status(400).json({ message: "Invalid Song payload", errors: result.errors });
        return;
      }

      const song = await Song.create(result.attrs);

      response.status(201).json(toSongResponse(song));
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        response.status(409).json({ message: "A Song with that title, artist, and album already exists." });
        return;
      }

      next(error);
    }
  });

  router.put("/:id", async (request, response, next) => {
    try {
      const { id } = request.params;

      if (!isValidSongId(id)) {
        response.status(404).json({ message: "Song not found" });
        return;
      }

      const result = validateSongPayload(request.body);

      if (result.errors) {
        response.status(400).json({ message: "Invalid Song payload", errors: result.errors });
        return;
      }

      const song = await Song.findByIdAndUpdate(id, result.attrs, { new: true, runValidators: true }).exec();

      if (!song) {
        response.status(404).json({ message: "Song not found" });
        return;
      }

      response.status(200).json(toSongResponse(song));
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        response.status(409).json({ message: "A Song with that title, artist, and album already exists." });
        return;
      }

      next(error);
    }
  });

  router.delete("/:id", async (request, response, next) => {
    try {
      const { id } = request.params;

      if (!isValidSongId(id)) {
        response.status(404).json({ message: "Song not found" });
        return;
      }

      const song = await Song.findByIdAndDelete(id).exec();

      if (!song) {
        response.status(404).json({ message: "Song not found" });
        return;
      }

      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
};
