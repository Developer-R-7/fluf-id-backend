import { prismaClient } from "../../config/index";
import { uuid } from "uuidv4";
import { bufferToHex } from "ethereumjs-util";
import { recoverPersonalSignature } from "eth-sig-util";
import { nanoid } from "nanoid";
import httpStatus from "http-status";
import ApiError from "../../config/apiError";
import jwt from "jsonwebtoken";
import env from "../../config/index";

export const handleCreateUser = async (data: {
  name: string;
  walletAddress: string;
}) => {
  const userExists = await prismaClient.user.findFirst({
    where: {
      account: {
        walletAddress: data.walletAddress,
      },
    },
  });

  if (userExists) {
    throw new ApiError("User already exists", httpStatus.BAD_REQUEST);
  }

  await prismaClient.user.create({
    data: {
      name: data.name,
      avatarUrl: "https://api.multiavatar.com/" + uuid() + ".png",
      account: {
        create: {
          walletAddress: data.walletAddress,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return true;
};

export const handleLoginUser = async (
  walletAddress: string,
  signature: string
) => {
  const account = await prismaClient.account.findUnique({
    where: {
      walletAddress: walletAddress,
    },
    select: {
      walletAddress: true,
      user: {
        select: {
          id: true,
          nonce: true,
          name: true,
        },
      },
    },
  });

  if (!account) {
    throw new ApiError("User account not found", httpStatus.NOT_FOUND);
  }

  const msg = `I am signing my one-time nonce: ${account.user.nonce}`;
  const msgBufferHex = bufferToHex(Buffer.from(msg, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  if (address.toLowerCase() !== walletAddress.toLowerCase()) {
    throw new ApiError("Invalid signature", httpStatus.UNAUTHORIZED);
  }

  const token = jwt.sign(
    {
      ...account.user,
      lastLogin: new Date(),
      walletAddress: account.walletAddress,
    },
    env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return {
    success: true,
    message: "User logged in successfully",
    data: {
      token,
      userId: account.user.id,
    },
  };
};

export const handleGenerateNonce = async (walletAddress: string) => {
  const account = await prismaClient.account.findUnique({
    where: {
      walletAddress,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!account) throw new ApiError("User not found", httpStatus.NOT_FOUND);

  const nonce = nanoid(16);

  await prismaClient.user.update({
    where: {
      id: account.user.id,
    },
    data: {
      nonce,
    },
  });

  return {
    success: true,
    message: "Nonce generated successfully",
    data: {
      nonce,
    },
  };
};
