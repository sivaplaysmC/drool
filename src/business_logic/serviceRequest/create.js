export { createServiceRequest };

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const createServiceRequest = async (
	prisma,
	generateSRID,
	{
		employeeID,
		firstName,
		lastName,
		department,
		mobileNumber,
		reasonForTravel,
		hodApprovalAttachment,
		serviceType,
		additionalDetails,
	}
) => {
	// Generate service request ID
	const serviceRequestID = generateSRID(serviceType);
	const fullname = firstName + ' ' + lastName;

	// Create new service request
	const newServiceRequest = await prisma.serviceRequest.create({
		data: {
			ID: serviceRequestID,
			serviceType,
			employeeID,
			name: fullname,
			department,
			mobileNumber,
			reasonForTravel,
			hodApprovalAttachment,
			status: 'Submitted',
			statusTimestamp: new Date(),
			createdAt: new Date(),
			lastModifiedAt: new Date(),
		},
	});

	// Create related service request model entry
	await getServiceRequestModel(serviceType, prisma).create({
		data: {
			...additionalDetails,
			serviceRequestID: serviceRequestID,
		},
	});

	return { status: 'ok' };
};

/**
 * @param {string} request
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestModel = (request, prisma) => {
	switch (request.toLowerCase()) {
		case 'flight':
			return prisma.flightRequest;
		case 'cab':
			return prisma.cabRequest;
		case 'hotel':
			return prisma.hotelRequest;
		default:
			throw Error('indvalID service request');
	}
};
