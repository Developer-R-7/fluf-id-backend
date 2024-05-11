import { Response, NextFunction, Request } from "express";
import { handleAddContractAddress, handleAppRegister } from "./user-service";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";

export const addContractAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { walletAddress, contractAddress } = req.body;

    if (!walletAddress || !contractAddress) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("Wallet address and contract address are required");
    }

    const options = await handleAddContractAddress(
      walletAddress,
      contractAddress
    );

    res.status(httpStatus.CREATED).send(options);
  }
);

export const appRegister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { appId, walletAddress } = req.body;

    const result = await handleAppRegister(appId, walletAddress);

    res.status(httpStatus.CREATED).send(result);
  }
);
