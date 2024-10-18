/*
  Warnings:

  - You are about to drop the column `requestType` on the `CabRequest` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Employee` table. All the data in the column will be lost.
  - The primary key for the `Otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNumber` on the `ServiceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ServiceRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[otp]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropIndex
DROP INDEX "Employee_email_key";

-- DropIndex
DROP INDEX "Employee_phone_key";

-- DropIndex
DROP INDEX "Otp_userId_key";

-- AlterTable
ALTER TABLE "CabRequest" DROP COLUMN "requestType";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "FlightRequest" ADD COLUMN     "lastModifiedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "Otp_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "ServiceRequest" DROP COLUMN "department",
DROP COLUMN "mobileNumber",
DROP COLUMN "name",
ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resendOtpCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Vendors" (
    "name" TEXT NOT NULL,
    "contact_no" TEXT NOT NULL,
    "pan" TEXT NOT NULL,
    "tan" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_beneficiary_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "registered_address" TEXT NOT NULL,
    "gst_number" TEXT NOT NULL,
    "msme_number" TEXT NOT NULL,
    "msme_certificate" BYTEA NOT NULL,
    "cancelled_cheque" BYTEA NOT NULL,
    "credit_period" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "place_of_supply" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendors_pan_key" ON "Vendors"("pan");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otp_key" ON "Otp"("otp");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userID_key" ON "Otp"("userID");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingManagerId_fkey" FOREIGN KEY ("reportingManagerId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
