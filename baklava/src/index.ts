import { createConnection } from "typeorm";
import "reflect-metadata";

import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";

import helmet from "helmet";
import morgan from "morgan";

import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(__dirname, "./config", ".env")
});

const main = async () => {
  const app = express()

    // TODO: remove
    .get("/", (_, res?: any) => res.send("Hello World!"))

    .use(helmet())
    .use(express.json())
    .use(cookieParser())
    .use(morgan("dev"))
    .use(
      cors({
        credentials: true,
        origin: process.env.ORIGIN,
        optionsSuccessStatus: 200
      })
    );

  const server = app.listen(process.env.PORT!, async () => {
    try {
      await createConnection();
      console.log("🚀 Connected to Distribution API Database - Initial Connection");
    } catch (err) {
      console.log("⚠️  Initial Distribution API Database connection error occured - ", err);

      setTimeout(() => {
        console.log("🤞 Shutting down application");

        server.close(() => {
          console.log("👋 All requests stopped, shutting down");
          process.exit();
        });
      }, 0);
    };
  });
};

main().catch((err?: any) => {
  console.log("⚠️  Error occured - ", err);
});
