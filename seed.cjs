const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
	// Seed Users
	const user1 = await prisma.user.create({
		data: {
			email: 'test1.asdf@gmail.com', // Corrected email
			phone: '1234567890',
			userType: 'EMPLOYEE',
			employee: {
				create: {
					ID: 'EMP001',
					department: 'Engineering',
					allocatedPerDiem: 500,
				},
			},
		},
	});

	const user2 = await prisma.user.create({
		data: {
			email: 'vendor1@example.com',
			phone: '0987654321',
			userType: 'VENDOR',
			vendor: {
				create: {
					company: 'VendorCorp',
					service: 'Catering',
				},
			},
		},
	});

	const user3 = await prisma.user.create({
		data: {
			email: 'admin1@example.com',
			phone: '1122334455',
			userType: 'ADMIN',
			admin: {
				create: {
					role: 'SuperAdmin',
					permissions: 'ALL',
				},
			},
		},
	});

	// Seed Service Requests
	const serviceRequest1 = await prisma.serviceRequest.create({
		data: {
			ID: 'SR001',
			employeeID: user1.employee.ID,
			reasonForTravel: 'DGCA',
			status: 'Submitted',
			serviceType: 'Flight',
			reviewed: false,
		},
	});

	console.log({ user1, user2, user3, serviceRequest1 });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
