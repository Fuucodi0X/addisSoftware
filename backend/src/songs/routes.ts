import { Router } from "express";
import type { FilterQuery } from "mongoose";
import { toSongResponse } from "./mapper.js";
import { Song, type SongDocument } from "./song.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

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

  return router;
};
