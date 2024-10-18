export { deleteServiceRequest };

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const deleteServiceRequest = async (ID, employeeID, prisma) => {
	const servReq = await prisma.serviceRequest.findUnique({
		where: {
			ID,
			employeeID,
		},
	});

	await getServiceRequestType(servReq.serviceType, prisma).delete({
		where: { serviceRequestID: ID },
	});

	await prisma.serviceRequest.delete({
		include: {
			CabRequest: true,
			FlightRequest: true,
			HotelRequest: true,
		},
		where: {
			ID,
			employeeID,
		},
	});
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestType = (serviceType, prisma) => {
	switch (serviceType) {
		case 'Flight':
			return prisma.flightRequest;
		case 'Cab':
			return prisma.cabRequest;
		case 'Hotel':
			return prisma.hotelRequest;
	}
};
