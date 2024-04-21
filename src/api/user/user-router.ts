import express from "express";
import { addContractAddress } from "./user-controller";

const app = express.Router();

app.put("/add-contract-address", addContractAddress);

export default app;
