import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { config } from "./config.js";
import { createSongRouter } from "./songs/routes.js";

interface CreateAppOptions {
  enforceMongoConnection?: boolean;
  isMongoConnected?: () => boolean;
}

export const createApp = ({
  enforceMongoConnection = process.env.NODE_ENV !== "test",
  isMongoConnected = () => mongoose.connection.readyState === 1
}: CreateAppOptions = {}) => {
  const app = express();

  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "song-library-backend",
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "not_connected",
      uptime: process.uptime()
    });
  });

  if (enforceMongoConnection) {
    app.use("/api/songs", (_request, response, next) => {
      if (!isMongoConnected()) {
        response.status(503).json({ message: "MongoDB is not connected" });
        return;
      }

      next();
    });
  }

  app.use("/api/songs", createSongRouter());

  app.use(
    (
      error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  );

  return app;
};
