import { prismaClient } from "../../config";
import ApiError from "../../config/apiError";
import httpStatus from "http-status";

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
    select: {
      id: true,
      contractAddress: true,
    },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  if (user.contractAddress) {
    throw new ApiError(
      "Contract address already added",
      httpStatus.BAD_REQUEST
    );
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

export const handleUserAppRegister = async (appId: number, userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  const getApp = await prismaClient.app.findUnique({
    where: {
      id: appId,
    },
  });

  if (!getApp) {
    throw new ApiError("Requested app not found", httpStatus.NOT_FOUND);
  }

  await prismaClient.userApp.create({
    data: {
      appId: appId,
      userId: user.id,
    },
  });

  return { success: true, message: "User successfully registered to the app" };
};

export const handleGetUserApp = async (userId: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  const getApps = await prismaClient.userApp.findMany({
    where: {
      userId: user.id,
    },
    select: {
      app: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Successfully fetched apps for user",
    apps: getApps || [],
  };
};
