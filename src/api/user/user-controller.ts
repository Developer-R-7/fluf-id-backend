import { Response, NextFunction, Request } from "express";
import {
  handleAddContractAddress,
  handleUserAppRegister,
} from "./user-service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { jwtReq } from "../../utils/types";

export const addContractAddress = catchAsync(
  async (req: jwtReq, res: Response, next: NextFunction) => {
    const response = await handleAddContractAddress(
      req.user.walletAddress,
      req.body.contractAddress
    );

    res.status(httpStatus.OK).send(response);
  }
);

export const userAppRegister = catchAsync(
  async (req: jwtReq, res: Response, next: NextFunction) => {
    const result = await handleUserAppRegister(req.body.appId, req.user.id);

    res.status(httpStatus.CREATED).send(result);
  }
);
