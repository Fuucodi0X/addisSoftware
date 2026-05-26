import { Router } from "express";
import { toSongResponse } from "./mapper.js";
import { Song } from "./song.js";

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

export const createSongRouter = () => {
  const router = Router();

  router.get("/", async (request, response, next) => {
    try {
      const page = parsePositiveInt(request.query.page, DEFAULT_PAGE);
      const requestedLimit = parsePositiveInt(request.query.limit, DEFAULT_LIMIT);
      const limit = Math.min(requestedLimit, MAX_LIMIT);
      const skip = (page - 1) * limit;

      const [songs, totalItems] = await Promise.all([
        Song.find().sort({ artist: 1, album: 1, title: 1 }).skip(skip).limit(limit).exec(),
        Song.countDocuments().exec()
      ]);

      response.status(200).json({
        items: songs.map(toSongResponse),
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
