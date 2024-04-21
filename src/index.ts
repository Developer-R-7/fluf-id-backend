import express from "express";
import Loaders from "./loaders";
import env from "./config/index";

async function startServer() {
  const app = express();

  await Loaders({ expressApp: app });

  app
    .listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    })
    .on("error", (err) => {
      process.exit(1);
    });
}

startServer();
