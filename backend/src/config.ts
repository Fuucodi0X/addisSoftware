import dotenv from "dotenv";

dotenv.config();

export const config = {
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/song-library",
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000)
} as const;
