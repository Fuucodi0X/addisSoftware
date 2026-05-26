import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";

export const SONG_GENRES = ["Ethio-jazz", "Pop", "Contemporary", "Soul", "Traditional"] as const;
export type SongGenre = (typeof SONG_GENRES)[number];

export interface SongAttrs {
  title: string;
  artist: string;
  album: string;
  genre: SongGenre;
  duration: string;
  artworkUrl?: string | null;
}

export interface SongDocument extends SongAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const songSchema = new Schema<SongDocument>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    artist: { type: String, required: true, trim: true, maxlength: 120 },
    album: { type: String, required: true, trim: true, maxlength: 120 },
    genre: { type: String, required: true, trim: true, enum: SONG_GENRES, maxlength: 80 },
    duration: { type: String, required: true, trim: true, match: /^\d{1,2}:[0-5]\d$/ },
    artworkUrl: { type: String, default: null, trim: true, maxlength: 2048 }
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
