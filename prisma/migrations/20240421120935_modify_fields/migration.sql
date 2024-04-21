/*
  Warnings:

  - You are about to drop the column `credentialID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passkey` on the `UserPasskey` table. All the data in the column will be lost.
  - Added the required column `credentialID` to the `UserPasskey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `UserPasskey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRegisterStatus" AS ENUM ('pending', 'registered');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credentialID",
DROP COLUMN "publicKey",
ADD COLUMN     "status" "UserRegisterStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "UserPasskey" DROP COLUMN "passkey",
ADD COLUMN     "credentialID" TEXT NOT NULL,
ADD COLUMN     "publicKey" TEXT NOT NULL;
