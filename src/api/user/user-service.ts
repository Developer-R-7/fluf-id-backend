import { UserRegisterStatus } from "@prisma/client";
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
      status: UserRegisterStatus.registered,
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
