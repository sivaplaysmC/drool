/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CabRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Confirmation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FlightRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotelRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "CabRequest" DROP CONSTRAINT "CabRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Confirmation" DROP CONSTRAINT "Confirmation_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "FlightRequest" DROP CONSTRAINT "FlightRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "HotelRequest" DROP CONSTRAINT "HotelRequest_serviceRequestID_fkey";

-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceRequest" DROP CONSTRAINT "ServiceRequest_employeeID_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "phone",
DROP COLUMN "userType",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "CabRequest";

-- DropTable
DROP TABLE "Confirmation";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "FlightRequest";

-- DropTable
DROP TABLE "HotelRequest";

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "ServiceRequest";

-- DropTable
DROP TABLE "Vendor";

-- DropEnum
DROP TYPE "FlightClass";

-- DropEnum
DROP TYPE "ReasonForTravel";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "SeatPreference";

-- DropEnum
DROP TYPE "ServiceType";

-- DropEnum
DROP TYPE "TripType";

-- DropEnum
DROP TYPE "UserType";
