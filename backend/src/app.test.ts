import request from "supertest";
import mongoose from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";
import { Song } from "./songs/song.js";

vi.mock("./songs/song.js", () => ({
  Song: {
    aggregate: vi.fn(),
    countDocuments: vi.fn(),
    distinct: vi.fn(),
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
  vi.mocked(Song.distinct).mockReturnValue(queryChain(["Ethio-jazz", "Pop"]) as never);
  vi.mocked(Song.aggregate).mockReturnValue(queryChain([]) as never);
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
      totalPages: 1,
      genres: ["Ethio-jazz", "Pop"]
    });
    expect(JSON.stringify(response.body)).not.toContain("_id");
    expect(JSON.stringify(response.body)).not.toContain("__v");
  });

  it("filters by search and genre before paginating", async () => {
    vi.mocked(Song.find).mockReturnValue(queryChain([]) as never);
    vi.mocked(Song.countDocuments).mockReturnValue(queryChain(0) as never);

    const response = await request(createApp()).get(
      "/api/songs?q=mulatu&genre=Ethio-jazz&page=2&limit=3"
    );

    expect(response.status).toBe(200);
    expect(Song.find).toHaveBeenCalledWith({
      $and: [
        {
          $or: [
            { title: /mulatu/i },
            { artist: /mulatu/i },
            { album: /mulatu/i },
            { genre: /mulatu/i }
          ]
        },
        { genre: /^Ethio-jazz$/i }
      ]
    });
    expect(Song.countDocuments).toHaveBeenCalledWith({
      $and: [
        {
          $or: [
            { title: /mulatu/i },
            { artist: /mulatu/i },
            { album: /mulatu/i },
            { genre: /mulatu/i }
          ]
        },
        { genre: /^Ethio-jazz$/i }
      ]
    });
    expect(response.body).toMatchObject({
      items: [],
      page: 2,
      limit: 3,
      totalItems: 0,
      totalPages: 0,
      genres: ["Ethio-jazz", "Pop"]
    });
  });
});

describe("song statistics endpoint", () => {
  it("returns global Song Library statistics", async () => {
    vi.mocked(Song.countDocuments).mockReturnValue(queryChain(20) as never);
    vi.mocked(Song.distinct)
      .mockReturnValueOnce(queryChain(["Aster Aweke", "Mulatu Astatke"]) as never)
      .mockReturnValueOnce(queryChain(["Kabu", "Mulatu Plays Mulatu", "Ebo"]) as never)
      .mockReturnValueOnce(queryChain(["Ethio-jazz", "Pop"]) as never);
    vi.mocked(Song.aggregate)
      .mockReturnValueOnce(
        queryChain([
          { _id: "Pop", songs: 8 },
          { _id: "Ethio-jazz", songs: 6 }
        ]) as never
      )
      .mockReturnValueOnce(
        queryChain([
          { _id: "Aster Aweke", songs: 7, albums: 3 },
          { _id: "Mulatu Astatke", songs: 4, albums: 2 }
        ]) as never
      )
      .mockReturnValueOnce(
        queryChain([
          { _id: "Kabu", songs: 3 },
          { _id: "Mulatu Plays Mulatu", songs: 3 }
        ]) as never
      );

    const response = await request(createApp()).get("/api/songs/stats");

    expect(response.status).toBe(200);
    expect(Song.countDocuments).toHaveBeenCalledWith({});
    expect(response.body).toEqual({
      totals: {
        songs: 20,
        artists: 2,
        albums: 3,
        genres: 2
      },
      songsByGenre: [
        { genre: "Pop", songs: 8 },
        { genre: "Ethio-jazz", songs: 6 }
      ],
      artists: [
        { artist: "Aster Aweke", songs: 7, albums: 3 },
        { artist: "Mulatu Astatke", songs: 4, albums: 2 }
      ],
      songsByAlbum: [
        { album: "Kabu", songs: 3 },
        { album: "Mulatu Plays Mulatu", songs: 3 }
      ]
    });
  });
});
