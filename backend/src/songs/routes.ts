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
