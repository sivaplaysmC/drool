import { sendEmail, verifyOtp } from '../business_logic/employee/login.js';
export {
	loginController,
	verifyOtpController,
	logoutController,
	verifyEmployeeExist,
};

import { z } from 'zod';

const staticOtp = () => '123456';

const randomOtp = () => {
	let otp = '';
	for (let i = 0; i < 6; i++) {
		otp += Math.floor(Math.random() * 10);
	}
	return otp;
};

const genOtp = process.env.DEV === '1' ? randomOtp : staticOtp;

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {import("resend").Resend} prisma
 *
 * @returns {import("express").Handler}
 **/
const loginController = (prisma, resend) => {
	const schema = z.object({
		email: z
			.string({ required_error: 'email is required' })
			.email('invalid email'),
	});

	return async (req, res, next) => {
		try {
			const { email } = await schema.parseAsync(req.body);

			await sendEmail(email, prisma, resend, genOtp);
			res.status(200).json({ status: 'ok' });
		} catch (e) {
			next(e);
		}
	};
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 *
 * @returns {import("express").Handler}
 **/
const verifyOtpController = (prisma) => {
	const schema = z.object({
		otp: z.string({ required_error: 'otp is required' }),
	});

	return async (req, res, next) => {
		try {
			const { otp } = await schema.parseAsync(req.body);

			const jawt = await verifyOtp(otp, prisma);

			res.cookie('auth', `${jawt}`, {
				httpOnly: true,
				maxAge: 1000000 * 60,
			})
				.status(200)
				.json({ status: 'ok' });
		} catch (e) {
			next(e);
		}
	};
};

const logoutController = () => {
	/**
	 * @param {import("express").Response} res
	 **/
	return (_, res, __) => {
		return res.cookie('auth', '', { maxAge: 0 }).status(200).send();
	};
};

// TODO: extract to business_logic
const verifyEmployeeExist = (prisma) => {
	return async (req, res, next) => {
		try {
			const exist = await prisma.employee.findUnique({
				where: {
					ID: req.body.id,
				},
			});

			if (exist) res.status(200).json({ exist });
			else {
				res.json({ exist: null }).status(200);
			}
		} catch (e) {
			next(e);
		}
	};
};
