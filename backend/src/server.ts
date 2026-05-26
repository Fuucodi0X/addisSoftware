import mongoose from "mongoose";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { Song } from "./songs/song.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

mongoose
  .connect(config.mongoUri)
  .then(async () => {
    await Song.collection.dropIndex("title_1_artist_1_album_1").catch((error: unknown) => {
      if (error instanceof Error && "codeName" in error && error.codeName === "IndexNotFound") {
        return;
      }

      throw error;
    });
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    console.warn("MongoDB connection failed; API shell is still running", error);
  });
