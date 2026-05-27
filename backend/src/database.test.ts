import { describe, expect, it, vi } from "vitest";
import { dropLegacySongDuplicateIndex, isIgnorableLegacyIndexDropError } from "./database.js";

describe("legacy Song index cleanup", () => {
  it("ignores missing legacy index and collection errors", async () => {
    await expect(
      dropLegacySongDuplicateIndex({
        dropIndex: vi.fn().mockRejectedValue({ codeName: "IndexNotFound" })
      })
    ).resolves.toBeUndefined();

    await expect(
      dropLegacySongDuplicateIndex({
        dropIndex: vi.fn().mockRejectedValue({ codeName: "NamespaceNotFound", code: 26 })
      })
    ).resolves.toBeUndefined();
  });

  it("rethrows unexpected index cleanup errors", async () => {
    const error = new Error("permission denied");

    await expect(
      dropLegacySongDuplicateIndex({
        dropIndex: vi.fn().mockRejectedValue(error)
      })
    ).rejects.toThrow(error);
  });

  it("recognizes MongoDB missing namespace and index error codes", () => {
    expect(isIgnorableLegacyIndexDropError({ code: 26 })).toBe(true);
    expect(isIgnorableLegacyIndexDropError({ code: 27 })).toBe(true);
    expect(isIgnorableLegacyIndexDropError({ codeName: "Unauthorized", code: 13 })).toBe(false);
  });
});
