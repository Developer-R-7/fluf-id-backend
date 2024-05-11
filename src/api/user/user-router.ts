import { addContractAddress, appRegister } from "./user-controller";
import express from "express";

const app = express.Router();

app.put("/update-user-contract", addContractAddress);
app.post("/app-register", appRegister);

export default app;
