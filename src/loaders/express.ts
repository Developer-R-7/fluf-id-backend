import { apiPrefix } from "./constants";
import { errorHandler, errorConverter } from "../shared/middleware";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import routes from "../api";

const corsOptions = {
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Wallet-Signature",
    "X-Authorization-token",
  ],
};

export default ({ app }: { app: express.Application }): void => {
  app.get("/health", (req, res) => {
    const healthcheck = {
      application: "passkey-server",
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
    try {
      return res.json(healthcheck);
    } catch (e) {
      return res.status(503).send();
    }
  });

  app.use(cors(corsOptions));

  app.use(bodyParser.json());

  app.use(apiPrefix, routes());

  app.use((req, res, next) => {
    console.log("No Resource Found");
    res.status(404).json({
      success: false,
      message: "Resource not found",
    });
  });

  app.use(errorConverter);
  app.use(errorHandler);
};
