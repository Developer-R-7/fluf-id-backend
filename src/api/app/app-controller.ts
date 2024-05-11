import { Response, NextFunction, Request } from "express";
import { handleAppRegister } from "./app-service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { jwtReq } from "../../utils/types";

export const appRegister = catchAsync(
  async (req: jwtReq, res: Response, next: NextFunction) => {
    const result = await handleAppRegister(req.body);

    res.status(httpStatus.CREATED).send(result);
  }
);
