import { loginUser, generateNonce, createUser } from "./auth-controller";
import { validate } from "../../shared/middleware";
import { userLoginSchema, userCreateSchema } from "./auth-schema";
import express from "express";

const app = express.Router();

app.get("/nonce/:walletAddress", generateNonce);

app.post("/login", validate("body", userLoginSchema), loginUser);

app.post("/create", validate("body", userCreateSchema), createUser);

export default app;
