import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export interface SongAttrs {
  title: string;
  artist: string;
  album: string;
  genre: string;
  artworkUrl?: string | null;
}

export interface SongDocument extends SongAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<SongDocument>(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: String, required: true, trim: true },
    album: { type: String, required: true, trim: true },
    genre: { type: String, required: true, trim: true },
    artworkUrl: { type: String, default: null, trim: true }
  },
  {
    timestamps: true
  }
);

songSchema.index({ title: 1, artist: 1, album: 1 }, { unique: true });

export type SongModel = Model<SongDocument>;
export type SongRecord = HydratedDocument<SongDocument> | (SongDocument & { _id: mongoose.Types.ObjectId });

export const Song = mongoose.models.Song
  ? (mongoose.models.Song as SongModel)
  : mongoose.model<SongDocument>("Song", songSchema);
