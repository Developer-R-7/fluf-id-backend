import express from "express";
import { register, registerResponse } from "./auth-controller";

const app = express.Router();

app.post("/register", register);
app.post("/register-response", registerResponse);
app.post("/login");
app.post("/login-response");

export default app;
