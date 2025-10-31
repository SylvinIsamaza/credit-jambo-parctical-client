/*
  Warnings:

  - You are about to drop the column `token` on the `sessions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accessToken]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshToken]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshExpiresAt` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'ADMIN', 'SUPER_ADMIN', 'MODERATOR');

-- DropIndex
DROP INDEX "public"."sessions_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "token",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "refreshExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CLIENT';

-- CreateIndex
CREATE UNIQUE INDEX "sessions_accessToken_key" ON "sessions"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refreshToken_key" ON "sessions"("refreshToken");
