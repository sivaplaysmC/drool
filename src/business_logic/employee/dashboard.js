const PAGE_SIZE = 40;

/**
 * @param {number} pagenum
 * @param {string} employee
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
export const getServiceRequestDetailsPaginated = async (
	pagenum,
	user,
	prisma
) => {
	let details;
	if (user.userType === 'EMPLOYEE') {
		details = await prisma.serviceRequest.findMany({
			skip: (pagenum - 1) * PAGE_SIZE,
			take: PAGE_SIZE,
			where: {
				employeeID: user.employee.ID,
			},
			include: {
				CabRequest: true,
				FlightRequest: true,
				HotelRequest: true,
				confirmations: true,
				employee: {
					include: {
						user: true
					}
				}
			},
		});
	} else {
		details = await prisma.serviceRequest.findMany({
			skip: (pagenum - 1) * PAGE_SIZE,
			take: PAGE_SIZE,
			include: {
				CabRequest: true,
				FlightRequest: true,
				HotelRequest: true,
				confirmations: true,
				employee: {
					include: {
						user: true
					}
				}
			},
		});
	}

	return details
};
