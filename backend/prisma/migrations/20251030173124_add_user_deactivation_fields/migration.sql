/*
  Warnings:

  - You are about to drop the column `accessToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `lowBalanceThreshold` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'TRANSACTION', 'SECURITY', 'LOGIN_SUCCESS', 'PASSWORD_RESET', 'EMAIL_CHANGED', 'TRANSACTION_PIN_CHANGED', 'ACCOUNT_PASSWORD_CHANGED', 'DEPOSIT_SUCCESS', 'WITHDRAWAL_SUCCESS', 'INSUFFICIENT_BALANCE', 'TRANSACTION_REVERSED', 'DEVICE_VERIFIED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OtpType" ADD VALUE 'EMAIL_VERIFICATION';
ALTER TYPE "OtpType" ADD VALUE 'PIN_CHANGE';
ALTER TYPE "OtpType" ADD VALUE 'PASSWORD_RESET';

-- DropIndex
DROP INDEX "public"."sessions_accessToken_key";

-- DropIndex
DROP INDEX "public"."sessions_refreshToken_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "accessToken",
DROP COLUMN "refreshToken",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "description",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "refId" TEXT NOT NULL,
ADD COLUMN     "reversedReason" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "lowBalanceThreshold",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivatedBy" TEXT,
ADD COLUMN     "deactivatedReason" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "profileImage" TEXT;

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "metadata" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_refId_key" ON "transactions"("refId");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
