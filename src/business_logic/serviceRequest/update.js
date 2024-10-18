export { getServiceRequestByID };

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestByID = async (ID, empID, prisma) => {
	return await prisma.serviceRequest.findUnique({
		where: {
			ID: ID,
			employeeID: empID,
		},
		include: {
			CabRequest: true,
			FlightRequest: true,
			HotelRequest: true,
			confirmations: true,
			employee: true,
		},
	});
};
