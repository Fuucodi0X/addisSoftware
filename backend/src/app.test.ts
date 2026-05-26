import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

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
