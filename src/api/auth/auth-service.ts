import crypto from "crypto";
import { prismaClient } from "../../config/index";
import ApiError from "../../config/apiError";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
} from "@simplewebauthn/server";
import {
  base64URLDecode,
  base64URLEncode,
  stringToUInt8Array,
  uint8ArrayToString,
} from "../../utils/helper";
import type { VerifyRegistrationResponseOpts } from "@simplewebauthn/server/script/registration/verifyRegistrationResponse.d.ts";
import { UserRegisterStatus } from "@prisma/client";

export const handleRegister = async (walletAddress: string) => {
  const checkUser = await prismaClient.user.findFirst({
    where: {
      account: {
        walletAddress: walletAddress,
      },
      status: UserRegisterStatus.registered,
    },
  });

  if (checkUser) {
    throw new ApiError("User already registered", 400);
  }

  const challenge = crypto.randomBytes(32);

  const checkWalletAddress = await prismaClient.user.findFirst({
    where: {
      account: {
        walletAddress: walletAddress,
      },
    },
  });

  if (checkWalletAddress) {
    await prismaClient.user.update({
      where: {
        id: checkWalletAddress.id,
      },
      data: {
        challengeString: base64URLEncode(challenge),
      },
    });

    const options = generateRegistrationOptions({
      rpName: "FHE Passkey Server",
      rpID: "localhost",
      userID: stringToUInt8Array(checkWalletAddress.id),
      userName: walletAddress,
      challenge: challenge,
      timeout: 600000,
      attestationType: "direct",
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "preferred",
      },
    });

    return options;
  }

  const user = await prismaClient.user.create({
    data: {
      account: {
        create: {
          walletAddress: walletAddress,
        },
      },
      name: "user",
      challengeString: base64URLEncode(challenge),
      status: UserRegisterStatus.pending,
    },
  });

  const options = generateRegistrationOptions({
    rpName: "FHE Passkey Server",
    rpID: "localhost",
    userID: stringToUInt8Array(user.id),
    userName: walletAddress,
    challenge: challenge,
    timeout: 600000,
    attestationType: "direct",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "preferred",
    },
  });

  return options;
};

export const handleRegisterResponse = async (body: any) => {
  if (!body.username) {
    throw new ApiError("Username is required", 400);
  }

  const user = await prismaClient.user.findFirst({
    where: {
      account: { walletAddress: body.username },
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.status === UserRegisterStatus.registered) {
    throw new ApiError("User already registered", 400);
  }

  // Decoding and preparing the payload for verification
  const clientDataJSON = base64URLEncode(base64URLDecode(body.clientData));
  const attestationObject = base64URLEncode(
    base64URLDecode(body.attestationData)
  );
  const expectedChallenge = base64URLEncode(
    base64URLDecode(user.challengeString)
  );

  const payload: VerifyRegistrationResponseOpts = {
    response: {
      id: body.credential.id,
      rawId: base64URLEncode(base64URLDecode(body.credential.id)),
      type: "public-key",
      response: {
        attestationObject: attestationObject,
        clientDataJSON: clientDataJSON,
      },
      clientExtensionResults: {},
    },
    expectedChallenge: expectedChallenge,
    expectedOrigin: "http://localhost:5174",
    expectedRPID: "localhost",
  };

  const verification = await verifyRegistrationResponse(payload);

  if (!verification.verified) {
    throw new ApiError("Invalid response", 400);
  }

  await prismaClient.userPasskey.create({
    data: {
      userId: user.id,
      credentialID: payload.response.id,
      publicKey: uint8ArrayToString(
        verification.registrationInfo.credentialPublicKey
      ),
    },
  });

  await prismaClient.user.update({
    where: { id: user.id },
    data: { status: UserRegisterStatus.registered },
  });

  return { success: true, message: "Register successful" };
};

export const handleLogin = async (walletAddress: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      account: { walletAddress: walletAddress },
      status: UserRegisterStatus.registered,
    },
  });

  if (!user) {
    throw new ApiError("User not found or not registered", 404);
  }

  const challenge = crypto.randomBytes(32);

  await prismaClient.user.update({
    where: { id: user.id },
    data: { challengeString: base64URLEncode(challenge) },
  });

  const getCredentialID = await prismaClient.userPasskey.findUnique({
    where: { userId: user.id },
  });

  const options = generateAuthenticationOptions({
    rpID: "localhost",
    allowCredentials: [
      {
        id: base64URLEncode(base64URLDecode(getCredentialID.credentialID)),
        transports: ["internal"],
      },
    ],
    userVerification: "preferred",
    challenge: challenge,
  });

  return options;
};

export const handleLoginResponse = async (body: any) => {
  if (!body.walletAddress) {
    throw new ApiError("walletAddress is required", 400);
  }

  const user = await prismaClient.user.findFirst({
    where: {
      account: { walletAddress: body.walletAddress },
      status: UserRegisterStatus.registered,
    },
  });

  if (!user) {
    throw new ApiError("User not found or not registered", 404);
  }

  const getPassKey = await prismaClient.userPasskey.findUnique({
    where: { userId: user.id },
  });

  const expectedChallenge = base64URLDecode(user.challengeString);

  const payload: VerifyAuthenticationResponseOpts = {
    response: {
      id: body.credential.id,
      rawId: base64URLEncode(base64URLDecode(body.credential.id)),
      type: "public-key",
      response: {
        clientDataJSON: base64URLEncode(base64URLDecode(body.clientData)),
        authenticatorData: base64URLEncode(
          base64URLDecode(body.authenticatorData)
        ),
        signature: base64URLEncode(base64URLDecode(body.signature)),
      },
      clientExtensionResults: {},
    },
    expectedChallenge: base64URLEncode(expectedChallenge),
    expectedOrigin: "http://localhost:5174",
    expectedRPID: "localhost",
    authenticator: {
      credentialID: getPassKey.credentialID,
      credentialPublicKey: stringToUInt8Array(getPassKey.publicKey),
      counter: 0,
    },
  };

  const verification = await verifyAuthenticationResponse(payload);

  if (!verification.verified) {
    throw new ApiError("Invalid login attempt", 400);
  }

  return { success: true, message: "Login successful" };
};
