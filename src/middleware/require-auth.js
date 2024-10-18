import { NotAuthorizedError } from '../error/not-authorized-error.js';

/**
 * ensures user is logged in
 */
export const requireAuth = (req, _res, next) => {
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}
	next();
};
