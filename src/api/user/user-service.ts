import { prismaClient } from "../../config";
import ApiError from "../../config/apiError";

export const handleAddContractAddress = async (
  walletAddress: string,
  contractAddress: string
) => {
  const user = await prismaClient.user.findFirst({
    where: {
      account: {
        walletAddress: walletAddress,
      },
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      contractAddress: contractAddress,
    },
  });

  return { success: true, message: "Contract address added" };
};

export const handleAppRegister = async (
  appId: string,
  walletAddress: string
) => {
  const user = await prismaClient.user.findFirst({
    where: {
      account: {
        walletAddress: walletAddress,
      },
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const getApp = await prismaClient.app.findUnique({
    where: {
      id: appId,
    },
  });

  if (!getApp) {
    throw new ApiError("App not found", 404);
  }

  await prismaClient.userApp.create({
    data: {
      appId: appId,
      userId: user.id,
    },
  });

  return { success: true, message: "User registered" };
};
