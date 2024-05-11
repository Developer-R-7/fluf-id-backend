import { Response, NextFunction, Request } from "express";
import {
  handleLoginUser,
  handleCreateUser,
  handleGenerateNonce,
} from "./auth-service";
import httpStatus from "http-status";
import ApiError from "../../config/apiError";
import catchAsync from "../../utils/catchAsync";

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    if (body.captchaToken) {
      delete body.captchaToken;
    }

    await handleCreateUser(body);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "User created successfully",
    });
  }
);

export const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["x-wallet-signature"] as string;

    if (!signature) {
      throw new ApiError("Signature is required", httpStatus.BAD_REQUEST);
    }

    const token = await handleLoginUser(req.body.walletAddress, signature);

    res.status(httpStatus.OK).json({
      ...token,
    });
  }
);

export const generateNonce = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const nonce = await handleGenerateNonce(req.params.walletAddress as string);

    res.status(httpStatus.OK).json({
      ...nonce,
    });
  }
);
