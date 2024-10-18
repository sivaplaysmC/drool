/*
  Warnings:

  - A unique constraint covering the columns `[serviceRequestID]` on the table `CabRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceRequestID]` on the table `Confirmation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceRequestID]` on the table `FlightRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceRequestID]` on the table `HotelRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CabRequest_serviceRequestID_key" ON "CabRequest"("serviceRequestID");

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_serviceRequestID_key" ON "Confirmation"("serviceRequestID");

-- CreateIndex
CREATE UNIQUE INDEX "FlightRequest_serviceRequestID_key" ON "FlightRequest"("serviceRequestID");

-- CreateIndex
CREATE UNIQUE INDEX "HotelRequest_serviceRequestID_key" ON "HotelRequest"("serviceRequestID");
