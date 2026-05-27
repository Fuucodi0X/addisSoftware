import mongoose from "mongoose";
import { Song } from "./songs/song.js";

const LEGACY_DUPLICATE_SONG_INDEX = "title_1_artist_1_album_1";
const IGNORABLE_DROP_INDEX_CODE_NAMES = new Set(["IndexNotFound", "NamespaceNotFound"]);
const IGNORABLE_DROP_INDEX_CODES = new Set([26, 27]);

type DropIndexCollection = Pick<typeof Song.collection, "dropIndex">;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isIgnorableLegacyIndexDropError = (error: unknown) => {
  if (!isRecord(error)) {
    return false;
  }

  return (
    (typeof error.codeName === "string" && IGNORABLE_DROP_INDEX_CODE_NAMES.has(error.codeName)) ||
    (typeof error.code === "number" && IGNORABLE_DROP_INDEX_CODES.has(error.code))
  );
};

export const dropLegacySongDuplicateIndex = async (
  collection: DropIndexCollection = Song.collection
) => {
  try {
    await collection.dropIndex(LEGACY_DUPLICATE_SONG_INDEX);
  } catch (error) {
    if (isIgnorableLegacyIndexDropError(error)) {
      return;
    }

    throw error;
  }
};

export const connectToMongo = async (mongoUri: string) => {
  await mongoose.connect(mongoUri);
  await dropLegacySongDuplicateIndex();
};
