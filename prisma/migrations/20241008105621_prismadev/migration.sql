/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `CabRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cabRequestID` on the `CabRequest` table. All the data in the column will be lost.
  - The primary key for the `Confirmation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `confirmationID` on the `Confirmation` table. All the data in the column will be lost.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employeeId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `reportingManagerId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Employee` table. All the data in the column will be lost.
  - The primary key for the `FlightRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `flightRequestID` on the `FlightRequest` table. All the data in the column will be lost.
  - The primary key for the `HotelRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hotelRequestID` on the `HotelRequest` table. All the data in the column will be lost.
  - The primary key for the `ServiceRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceRequestID` on the `ServiceRequest` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Vendor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Vendor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ID]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ID]` on the table `ServiceRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ID` to the `ServiceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "CabRequest" DROP CONSTRAINT "CabRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_reportingManagerId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "FlightRequest" DROP CONSTRAINT "FlightRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "HotelRequest" DROP CONSTRAINT "HotelRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userID_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_employeeID_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropIndex
DROP INDEX "Admin_userId_key";

-- DropIndex
DROP INDEX "Employee_employeeId_key";

-- DropIndex
DROP INDEX "Employee_userId_key";

-- DropIndex
DROP INDEX "ServiceRequest_serviceRequestID_key";

-- DropIndex
DROP INDEX "Vendor_userId_key";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "CabRequest" DROP CONSTRAINT "CabRequest_pkey",
DROP COLUMN "cabRequestID",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "CabRequest_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_pkey",
DROP COLUMN "confirmationID",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "Confirmation_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "employeeId",
DROP COLUMN "reportingManagerId",
DROP COLUMN "userId",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD COLUMN     "reportingManagerID" TEXT,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "FlightRequest" DROP CONSTRAINT "FlightRequest_pkey",
DROP COLUMN "flightRequestID",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "FlightRequest_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "HotelRequest" DROP CONSTRAINT "HotelRequest_pkey",
DROP COLUMN "hotelRequestID",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "HotelRequest_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_pkey",
DROP COLUMN "serviceRequestID",
ADD COLUMN     "ID" TEXT NOT NULL,
ADD CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("ID");

-- AlterTable
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "ID" SERIAL NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "Vendor_pkey" PRIMARY KEY ("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userID_key" ON "Admin"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_ID_key" ON "Employee"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userID_key" ON "Employee"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_ID_key" ON "ServiceRequest"("ID");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userID_key" ON "Vendor"("userID");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingManagerID_fkey" FOREIGN KEY ("reportingManagerID") REFERENCES "Employee"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightRequest" ADD CONSTRAINT "FlightRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelRequest" ADD CONSTRAINT "HotelRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabRequest" ADD CONSTRAINT "CabRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;
