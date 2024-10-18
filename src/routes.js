import {
	loginController,
	logoutController,
	verifyEmployeeExist,
	verifyOtpController,
} from './controllers/employee.js';

import { requireAuth, currentUser, ErrorHandler } from './middleware/index.js';
import {
	deleteServiceRequestController,
	getServiceRequestsController,
	createServiceRequestController,
	getServiceRequestsByIDController,
	editServiceRequestController,
} from './controllers/serviceRequest.js';

import {
	createVendorController,
	deleteVendorController,
	getVendorByIDController,
	getVendorsPaginatedController,
	updateVendorController,
} from './controllers/vendor.js';
import {
	getRequestsAggregatedController,
	getServiceRequestByIDController,
} from './controllers/adminDashboard.js';

export { setuproutes };

/**
 * @param {import("express").Express} app
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {import("resend").Resendd} resend
 **/
const setuproutes = (app, prisma, resend) => {
	app.use('/documents', express.static('documents'));

	// Check [Controllers README](./src/controllers/README.md) for explanation
	// about dependency injection

	// Do not enforce authentication here.
	app.post('/employee/login', loginController(prisma, resend));
	app.post('/employee/verify', verifyOtpController(prisma));

	app.use(currentUser);
	app.use(requireAuth);

	app.post('/employee/logout', logoutController());
	app.get('/employee/self', (req, res, _next) => {
		res.status(200).json(req.currentUser);
	});
	app.post('/employee/exist', verifyEmployeeExist(prisma));

	app.get('/servicerequest', getServiceRequestsController(prisma));
	app.get('/servicerequest/:id', getServiceRequestsByIDController(prisma));
	app.delete('/servicerequest/:id', deleteServiceRequestController(prisma));
	app.patch('/servicerequest/:id', editServiceRequestController(prisma));
	app.post(
		'/servicerequest',
		createServiceRequestController(prisma, generateSRID)
	);

	app.post('/vendor', createVendorController(prisma));
	app.delete('/vendor', deleteVendorController(prisma));
	app.get('/vendor', getVendorByIDController(prisma));
	app.get('/vendor/:pagenum', getVendorsPaginatedController(prisma));
	app.put('/vendor', updateVendorController(prisma));

	app.get('/admin/requests', getRequestsAggregatedController(prisma));
	app.get('/admin', getServiceRequestByIDController(prisma));

	app.use(ErrorHandler);
};

// TODO: Extract this function to a better place.
async function generateSRID(requestType, prisma) {
	const typeRanges = {
		Flight: { min: 1, max: 100000 },
		Hotel: { min: 100001, max: 200000 },
		Cab: { min: 200001, max: 300000 },
	};

	const upperCaseRequestType = requestType.toUpperCase();
	const { min, max } = typeRanges[requestType];

	const latestRequest = await prisma.serviceRequest.findMany({
		where: {
			serviceType: requestType,
		},
		orderBy: {
			ID: 'desc',
		},
		take: 1,
	});

	let nextValue;

	if (latestRequest.length === 0) {
		nextValue = min;
	} else {
		const lastID = latestRequest[0].ID;
		const lastSequenceNumber = parseInt(lastID.split('-')[2], 10);

		nextValue = lastSequenceNumber + 1;

		if (nextValue > max) {
			throw new Error(
				`Sequence limit exceeded for service type: ${requestType}`
			);
		}
	}

	return `SRN-${upperCaseRequestType}-${String(nextValue).padStart(6, '0')}`;
}
