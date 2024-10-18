import {
	createServiceRequest,
	deleteServiceRequest,
	getServiceRequestByID,
} from '../business_logic/serviceRequest/index.js';
import { getServiceRequestDetailsPaginated } from '../business_logic/employee/dashboard.js';
import { upload } from '../middleware/upload.js';

export {
	createServiceRequestController,
	deleteServiceRequestController,
	getServiceRequestsController,
	getServiceRequestsByIDController,
};

function convertDatesInObject(obj) {
	const newObj = {};

	const isObject = obj !== null && typeof obj === 'object';

	if (!isObject) {
		return obj;
	}

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];

			if (value === '') {
				newObj[key] = null;
				continue;
			}

			// Check if the value is a string that can be parsed as a date
			if (typeof value === 'string' && !isNaN(Date.parse(value))) {
				newObj[key] = new Date(value); // Convert to Date object
			} else if (Array.isArray(value)) {
				// If it's an array, map through it and convert dates if necessary
				newObj[key] = value.map((item) =>
					typeof item === 'string' && !isNaN(Date.parse(item))
						? new Date(item)
						: item === ''
							? null
							: item
				);
			} else if (value !== null && typeof value === 'object') {
				newObj[key] = convertDatesInObject(value);
			} else {
				newObj[key] = value;
			}
		}
	}

	return newObj;
}
/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const createServiceRequestController = (prisma, generateSRID) => {
	return async (req, res, next) => {
		// Handle the file upload with Multer middleware

		upload.single('hodApprovalAttachment')(req, res, async (err) => {
			if (err) {
				return res.status(400).json({ error: err.message });
			}

			const {
				reasonForTravel,
				urgentRequest,
				serviceType,
				additionalDetails,
			} = convertDatesInObject(req.body);
			const urgentRequestData = Boolean(urgentRequest);
			const employeeID = req.body.employeeID;

			try {
				// Generate a unique service request ID
				const serviceRequestID = await generateSRID(
					serviceType,
					prisma
				);
				console.log(serviceRequestID);
				// Create a base service request
				/**
				 * @type {import("@prisma/client").createServiceRequestParams}
				 **/
				const serviceRequestData = {
					ID: serviceRequestID,
					employeeID,
					reasonForTravel,
					status: 'Submitted',
					urgentRequest: urgentRequestData,
					serviceType,
					hodApprovalAttachment: req.file ? req.file.path : null,
				};
				// console.log(serviceRequestData)
				// console.log('additional',additionalDetails);
				// Conditionally create associated service requests based on type
				switch (serviceType.toLowerCase()) {
					case 'flight':
						serviceRequestData.FlightRequest = {
							create: additionalDetails,
						};
						break;
					case 'cab':
						serviceRequestData.CabRequest = {
							create: additionalDetails,
						};
						break;
					case 'hotel':
						serviceRequestData.HotelRequest = {
							create: additionalDetails,
						};
						break;
				}

				const result = await prisma.serviceRequest.create({
					data: serviceRequestData,
				});

				res.status(201).json(result);
			} catch (error) {
				next(error);
				console.log(error);
			}
		});
	};
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const deleteServiceRequestController = (prisma) => {
	/**
	 * @param {import("express").Request}  req
	 * @param {import("express").Response}  res
	 * @param {import("express").NextFunction}  next
	 **/
	return async (req, res, next) => {
		const { employeeID } = req.currentUser;
		const { id } = req.params;

		try {
			const result = await deleteServiceRequest(id, employeeID, prisma);

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestsController = (prisma) => {
	/**
	 * @param {import("express").Request}  req
	 * @param {import("express").Response}  res
	 * @param {import("express").NextFunction}  next
	 **/
	return async (req, res, next) => {
		try {
			const { pagenum } = req.query;

			const result = await getServiceRequestDetailsPaginated(
				Number(pagenum),
				req.currentUser,
				prisma
			);
			res.status(200).json(result);
		} catch (e) {
			next(e);
		}
	};
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestsByIDController = (prisma) => {
	/**
	 * @param {import("express").Request}  req
	 * @param {import("express").Response}  res
	 * @param {import("express").NextFunction}  next
	 **/

	return async (req, res, next) => {
		try {
			const { id } = req.params;
			const us = req.currentUser;
			const empID = us.employee.ID;

			const result = await getServiceRequestByID(id, empID, prisma);
			res.status(200).json(result);
		} catch (e) {
			next(e);
		}
	};
};

const transformer = (data) => {
	const { HotelRequest, CabRequest, FlightRequest } = data;

	if (data.CabRequest) {
		data.CabRequest = {
			update: {
				data: {
					...CabRequest,
				},
			},
		};
	}

	if (data.HotelRequest) {
		data.HotelRequest = {
			update: {
				data: {
					...HotelRequest,
				},
			},
		};
	}
	if (data.FlightRequest) {
		data.FlightRequest = {
			update: {
				data: {
					...FlightRequest,
				},
			},
		};
	}

	return data;
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const updateServiceRequest = async (ID, empID, data, prisma) => {
	return await prisma.serviceRequest.update({
		where: {
			ID: ID,
			employeeID: empID,
		},
		include: {
			CabRequest: true,
			FlightRequest: true,
			HotelRequest: true,
		},
		data: transformer(data),
	});
};

export const editServiceRequestController = (prisma) => {
	/**
	 * @param {import("express").Request}  req
	 * @param {import("express").Response}  res
	 * @param {import("express").NextFunction}  next
	 **/
	return async (req, res, next) => {
		const { employeeID } = req.currentUser;
		const { id } = req.params;

		const data = req.body;
		try {
			const result = await updateServiceRequest(
				id,
				employeeID,
				data,
				prisma
			);
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
};
