import { appRegister } from "./app-controller";
import { auth, validate } from "../../shared/middleware";
import { registerAppSchema } from "./app-schema";
import express from "express";

const app = express.Router();

app.post("/register", auth, validate("body", registerAppSchema), appRegister);

export default app;
