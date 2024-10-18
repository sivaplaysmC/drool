import { BadRequestError } from '../../error/bad-request-error.js';

/**
 * @param {string} requestID
 * @param {import("@prisma/client").PrismaClient} prisma
 * @returns {Promise<object|null>}
 */
export const getServiceRequestDetailsByID = async (
	requestID,
	empID,
	prisma
) => {
	try {
		const serviceRequest = await prisma.serviceRequest.findUnique({
			where: {
				ID: requestID,
				employeeID: empID,
			},
		});

		return serviceRequest;
	} catch (error) {
		console.error('Error fetching service request details:', error);
		throw new BadRequestError('Could not fetch service request details.');
	}
};
