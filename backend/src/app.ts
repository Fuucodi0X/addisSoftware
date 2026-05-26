import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { config } from "./config.js";

export const createApp = () => {
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

  return app;
};
