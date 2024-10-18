import jwt from 'jsonwebtoken';

/**
 * sets the currently signed in user in the request context.
 */
export const currentUser = (req, _res, next) => {
	const { auth } = req.cookies;

	try {
		req.currentUser = jwt.verify(auth, process.env.JWT_KEY);
	} catch (err) {
		next(err);
	}
	next();
};
