import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import * as yup from "yup";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envSchema = yup.object().shape({
  NODE_ENV: yup
    .string()
    .oneOf(["development", "production", "test"])
    .default("development"),
  PORT: yup.string().default("3000"),
  DATABASE_URL: yup.string().required(),
  JWT_SECRET: yup.string().required(),
});

const parsedEnv = envSchema.validateSync(process.env, {
  abortEarly: false,
  stripUnknown: true,
});

const env = parsedEnv;

export const prismaClient = new PrismaClient({
  errorFormat: "pretty",
});

export default env;
