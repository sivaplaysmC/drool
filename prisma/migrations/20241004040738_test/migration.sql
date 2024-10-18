/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('Submitted', 'In_Progress', 'Confirmed', 'Completed', 'Rejected', 'Cancelled');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('Flight', 'Hotel', 'Cab');

-- CreateEnum
CREATE TYPE "ReasonForTravel" AS ENUM ('DGCA', 'Airport_Visit', 'Audit', 'Workshop_Seminar', 'Sales_Travel', 'Partner_Visit');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('One_Way', 'Round_Trip', 'Multi_City');

-- CreateEnum
CREATE TYPE "SeatPreference" AS ENUM ('Window', 'Aisle', 'No_Preference');

-- CreateEnum
CREATE TYPE "FlightClass" AS ENUM ('Economy', 'Business', 'First_Class');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "userType" "UserType" NOT NULL;

-- CreateTable
CREATE TABLE "Stud" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "age" INTEGER NOT NULL,

    CONSTRAINT "Stud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "department" TEXT,
    "reportingManagerId" TEXT,
    "allocatedPerDiem" INTEGER,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "service" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "serviceRequestID" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "employeeID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "mobileNumber" VARCHAR(15) NOT NULL,
    "reasonForTravel" "ReasonForTravel" NOT NULL,
    "hodApprovalAttachment" VARCHAR(255),
    "status" "RequestStatus" NOT NULL DEFAULT 'Submitted',
    "statusTimestamp" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("serviceRequestID")
);

-- CreateTable
CREATE TABLE "FlightRequest" (
    "flightRequestID" SERIAL NOT NULL,
    "serviceRequestID" TEXT NOT NULL,
    "tripType" "TripType" NOT NULL,
    "origin" TEXT[],
    "destination" TEXT[],
    "departureDate" TIMESTAMP(3) NOT NULL,
    "arrivalDate" TIMESTAMP(3),
    "departureTimePreference" TIMESTAMP(3),
    "arrivalTimePreference" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seatPreference" "SeatPreference",
    "class" "FlightClass" NOT NULL,

    CONSTRAINT "FlightRequest_pkey" PRIMARY KEY ("flightRequestID")
);

-- CreateTable
CREATE TABLE "HotelRequest" (
    "hotelRequestID" SERIAL NOT NULL,
    "serviceRequestID" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "checkInTime" TIMESTAMP(3),
    "checkOutDate" TIMESTAMP(3) NOT NULL,
    "checkOutTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HotelRequest_pkey" PRIMARY KEY ("hotelRequestID")
);

-- CreateTable
CREATE TABLE "CabRequest" (
    "cabRequestID" SERIAL NOT NULL,
    "serviceRequestID" TEXT NOT NULL,
    "requestType" VARCHAR(50) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100),
    "pickUpAddress" VARCHAR(255) NOT NULL,
    "dropAddress" VARCHAR(255),
    "dateOfTravel" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "pickUpTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CabRequest_pkey" PRIMARY KEY ("cabRequestID")
);

-- CreateTable
CREATE TABLE "Confirmation" (
    "confirmationID" SERIAL NOT NULL,
    "serviceRequestID" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "perDiemAllowance" DECIMAL(10,2),
    "confirmationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Confirmation_pkey" PRIMARY KEY ("confirmationID")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeId_key" ON "Employee"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_phone_key" ON "Employee"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userId_key" ON "Vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_serviceRequestID_key" ON "ServiceRequest"("serviceRequestID");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_userId_key" ON "Otp"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightRequest" ADD CONSTRAINT "FlightRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("serviceRequestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelRequest" ADD CONSTRAINT "HotelRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("serviceRequestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CabRequest" ADD CONSTRAINT "CabRequest_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("serviceRequestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation" ADD CONSTRAINT "Confirmation_serviceRequestID_fkey" FOREIGN KEY ("serviceRequestID") REFERENCES "ServiceRequest"("serviceRequestID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
