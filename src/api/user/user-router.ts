import {
  addContractAddress,
  userAppRegister,
  getUserApp,
} from "./user-controller";
import { auth, validate } from "../../shared/middleware";
import {
  userRegisterAppSchema,
  updateContractAddressSchema,
} from "./user-schema";
import express from "express";

const app = express.Router();

app.put(
  "/update-contract",
  auth,
  validate("body", updateContractAddressSchema),
  addContractAddress
);

app.post(
  "/app-register",
  auth,
  validate("body", userRegisterAppSchema),
  userAppRegister
);

app.get("/apps", auth, getUserApp);

export default app;
