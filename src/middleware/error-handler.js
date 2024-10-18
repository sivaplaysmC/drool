import { ZodError } from 'zod';
import { CustomError } from '../error/custom-error.js';

export const ErrorHandler = (err, req, res, next) => {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.send({ errors: err.serializeErrors() });
	}

	if (err instanceof ZodError) {
		return res.status(406).send({ errors: err });
	}

	res.status(400).send({
		error: err,
	});
};
