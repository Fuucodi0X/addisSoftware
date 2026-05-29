import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CachedArtworkImage, clearCachedArtworkImages } from "./CachedArtworkImage";

const artworkUrl = "https://example.test/artwork.jpg";
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

const setUrlMethod = (method: "createObjectURL" | "revokeObjectURL", value: unknown) => {
  Object.defineProperty(URL, method, {
    configurable: true,
    value
  });
};

const stubObjectUrls = () => {
  const createObjectURL = vi.fn(() => "blob:cached-artwork");
  const revokeObjectURL = vi.fn();

  setUrlMethod("createObjectURL", createObjectURL);
  setUrlMethod("revokeObjectURL", revokeObjectURL);

  return { createObjectURL, revokeObjectURL };
};

afterEach(() => {
  clearCachedArtworkImages();
  setUrlMethod("createObjectURL", originalCreateObjectURL);
  setUrlMethod("revokeObjectURL", originalRevokeObjectURL);
  vi.unstubAllGlobals();
});

describe("CachedArtworkImage", () => {
  it("deduplicates image fetches for matching source URLs in the current session", async () => {
    const { createObjectURL } = stubObjectUrls();
    const fetchMock = vi.fn(async () => ({
      blob: async () => new Blob(["image"], { type: "image/jpeg" }),
      ok: true
    }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <div>
        <CachedArtworkImage src={artworkUrl} alt="Catalog artwork" />
        <CachedArtworkImage src={artworkUrl} alt="Footer artwork" />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByAltText("Catalog artwork").getAttribute("src")).toBe("blob:cached-artwork");
      expect(screen.getByAltText("Footer artwork").getAttribute("src")).toBe("blob:cached-artwork");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(artworkUrl, { cache: "force-cache", mode: "cors" });
    expect(createObjectURL).toHaveBeenCalledTimes(1);
  });

  it("reuses an already cached object URL without fetching the source again", async () => {
    stubObjectUrls();
    const fetchMock = vi.fn(async () => ({
      blob: async () => new Blob(["image"], { type: "image/jpeg" }),
      ok: true
    }));
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = render(<CachedArtworkImage src={artworkUrl} alt="Catalog artwork" />);

    await waitFor(() => {
      expect(screen.getByAltText("Catalog artwork").getAttribute("src")).toBe("blob:cached-artwork");
    });

    rerender(<CachedArtworkImage src={artworkUrl} alt="Catalog artwork" />);

    await waitFor(() => {
      expect(screen.getByAltText("Catalog artwork").getAttribute("src")).toBe("blob:cached-artwork");
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to the source URL when programmatic image loading is blocked", async () => {
    stubObjectUrls();
    const fetchMock = vi.fn(async () => {
      throw new Error("CORS blocked");
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CachedArtworkImage src={artworkUrl} alt="Catalog artwork" />);

    await waitFor(() => {
      expect(screen.getByAltText("Catalog artwork").getAttribute("src")).toBe(artworkUrl);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
