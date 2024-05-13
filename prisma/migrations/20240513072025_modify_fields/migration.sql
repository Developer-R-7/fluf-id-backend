/*
  Warnings:

  - You are about to drop the column `challengeString` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserPasskey` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contractAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPasskey" DROP CONSTRAINT "UserPasskey_userId_fkey";

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "logoUrl" TEXT,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "App_id_seq";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "challengeString",
DROP COLUMN "status",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "nonce" TEXT;

-- DropTable
DROP TABLE "UserPasskey";

-- DropEnum
DROP TYPE "UserRegisterStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Account_walletAddress_key" ON "Account"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_contractAddress_key" ON "User"("contractAddress");
