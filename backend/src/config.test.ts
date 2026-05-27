import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeCorsOrigin } from "./config.js";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("normalizeCorsOrigin", () => {
  it("removes trailing slashes from deployed frontend origins", () => {
    expect(normalizeCorsOrigin("https://addis-software-frontend-iota.vercel.app/")).toBe(
      "https://addis-software-frontend-iota.vercel.app"
    );
  });

  it("keeps localhost origins with ports intact", () => {
    expect(normalizeCorsOrigin("http://localhost:5173")).toBe("http://localhost:5173");
  });

  it("normalizes pasted URLs down to the browser origin", () => {
    expect(normalizeCorsOrigin(" https://example.com/catalog?page=1 ")).toBe("https://example.com");
  });
});

describe("backend CORS configuration", () => {
  it("serves an exact browser origin when CORS_ORIGIN was configured with a trailing slash", async () => {
    vi.stubEnv("CORS_ORIGIN", "https://addis-software-frontend-iota.vercel.app/");
    vi.resetModules();

    const { createApp } = await import("./app.js");
    const response = await request(createApp())
      .get("/health")
      .set("Origin", "https://addis-software-frontend-iota.vercel.app");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://addis-software-frontend-iota.vercel.app"
    );
  });
});
