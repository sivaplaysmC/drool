import jwt from 'jsonwebtoken';

export { sendEmail, verifyOtp };

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {import("resend").Resend} resend
 **/
const sendEmail = async (email, prisma, resend, genOtp) => {
	// 1. Get userID
	// 2. Store userID and generated otp in otp model
	// 3. Send email, with generated OTP

	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	});

	if (!user) {
		throw new Error();
	}

	const otpExists = await prisma.otp.findFirst({
		where: {
			userID: user.ID,
		},
	});

	if (otpExists) {
		await prisma.otp.delete({
			where: {
				userID: user.ID,
			},
		});
	}

	const otp = genOtp(6);

	const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

	const _otpEntry = await prisma.otp.create({
		data: {
			userID: user.ID,
			otp: otp,
			expiresAt: expiresAt,
		},
	});

	// await resend.emails.send({
	// 	from: 'onboarding@resend.dev',
	// 	to: email,
	// 	subject: 'Hello World',
	// 	html: `${otp}`,
	// });
};

/**
 * @param {String} otp
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
// TODO: add JWE to client token stack
const verifyOtp = async (otp, prisma) => {
	const otpEntry = await prisma.otp.findFirst({
		where: {
			otp: otp,
		},
	});

	if (otpEntry == null) {
		throw new Error();
	}

	await prisma.otp.delete({ where: { otp: otp } });

	const user = await prisma.user.findUnique({
		where: { ID: otpEntry.userID },
		include: {
			employee: true,
		},
	});
	const employee = await prisma.employee.findUnique({
		where: {
			userID: otpEntry.userID,
		},
	});

	const empID = employee.employeeID;

	const jawt = jwt.sign({ ...user, empID }, process.env.JWT_KEY);

	return jawt;
};
