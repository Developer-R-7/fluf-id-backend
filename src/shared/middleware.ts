import { Request, Response, NextFunction } from "express";
import ApiError from "../config/apiError";
import * as yup from "yup";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";
import env from "../config";
import httpStatus from "http-status";

export const auth = catchAsync(
  async (req: Request & { user: any }, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError("Unauthorized", httpStatus.UNAUTHORIZED);

    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (!decoded) throw new ApiError("Unauthorized", httpStatus.UNAUTHORIZED);

    req.user = decoded;

    next();
  }
);

export const errorConverter = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(err instanceof ApiError)) {
    console.error(err);
    next(
      new ApiError(
        "Oops! something went wrong",
        httpStatus.INTERNAL_SERVER_ERROR
      )
    );
    return;
  }

  next(err);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const success = err.success || false;
  const message = err.message || "Oops! something went wrong";

  if (env.NODE_ENV === "development")
    console.error(
      `${JSON.stringify({
        request: {
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
          body: req.body,
          query: req.query,
          params: req.params,
        },
        error: message,
      })}`
    );
  else
    console.error(
      `${JSON.stringify({
        request: {
          url: req.originalUrl,
          method: req.method,
          ip: req.ip,
        },
        error: message,
      })}`
    );

  const errorResponse = {
    success,
    message,
  };

  if (err.data) errorResponse["data"] = err.data;
  res.status(statusCode).json(errorResponse);
};

export const validate = (
  location: "query" | "body" | "params",
  schema: yup.ObjectSchema<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let _location: any;
      switch (location) {
        case "query":
          _location = req.query;
          break;
        case "body":
          _location = req.body;
          break;
        case "params":
          _location = req.params;
          break;
        default:
          throw new Error(`Invalid location: ${location}`);
      }

      await schema.validate(_location, { abortEarly: false });
      next();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
};
