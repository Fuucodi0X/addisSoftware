import request from "supertest";
import mongoose from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import { Song } from "./songs/song.js";

vi.mock("./songs/song.js", () => ({
  Song: {
    countDocuments: vi.fn(),
    find: vi.fn()
  }
}));

const queryChain = <T>(value: T) => {
  const chain = {
    exec: vi.fn().mockResolvedValue(value),
    limit: vi.fn(),
    skip: vi.fn(),
    sort: vi.fn()
  };

  chain.sort.mockReturnValue(chain);
  chain.skip.mockReturnValue(chain);
  chain.limit.mockReturnValue(chain);

  return chain;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("health endpoint", () => {
  it("returns backend health status", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: "ok",
      service: "song-library-backend"
    });
    expect(response.body).toHaveProperty("uptime");
  });
});

describe("song list endpoint", () => {
  it("returns paginated public Song responses", async () => {
    const now = new Date("2026-01-02T03:04:05.000Z");

    vi.mocked(Song.find).mockReturnValue(
      queryChain([
        {
          _id: new mongoose.Types.ObjectId("64f111111111111111111111"),
          __v: 0,
          title: "Yekermo Sew",
          artist: "Mulatu Astatke",
          album: "Ethiopiques, Vol. 4",
          genre: "Ethio-jazz",
          artworkUrl: null,
          createdAt: now,
          updatedAt: now
        }
      ]) as never
    );
    vi.mocked(Song.countDocuments).mockReturnValue(queryChain(1) as never);

    const response = await request(createApp()).get("/api/songs?page=1&limit=5");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      items: [
        {
          id: "64f111111111111111111111",
          title: "Yekermo Sew",
          artist: "Mulatu Astatke",
          album: "Ethiopiques, Vol. 4",
          genre: "Ethio-jazz",
          artworkUrl: null,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        }
      ],
      page: 1,
      limit: 5,
      totalItems: 1,
      totalPages: 1
    });
    expect(JSON.stringify(response.body)).not.toContain("_id");
    expect(JSON.stringify(response.body)).not.toContain("__v");
  });
});
