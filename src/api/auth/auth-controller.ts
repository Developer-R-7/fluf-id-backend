import { Response, NextFunction, Request } from "express";
import {
  handleRegister,
  handleRegisterResponse,
  handleLogin,
  handleLoginResponse,
} from "./auth-service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("Wallet address is required");
    }

    const options = await handleRegister(walletAddress);
    res.status(httpStatus.CREATED).send(options);
  }
);

export const registerResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = await handleRegisterResponse(req.body);
    res.status(httpStatus.CREATED).send(options);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("Wallet address is required");
    }

    const options = await handleLogin(walletAddress);
    res.status(httpStatus.CREATED).send(options);
  }
);

export const loginResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = await handleLoginResponse(req.body);
    res.status(httpStatus.CREATED).send(options);
  }
);
