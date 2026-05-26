import mongoose from "mongoose";
import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp();

app.listen(config.port, () => {
  console.log(`Backend listening on port ${config.port}`);
});

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    console.warn("MongoDB connection failed; API shell is still running", error);
  });
