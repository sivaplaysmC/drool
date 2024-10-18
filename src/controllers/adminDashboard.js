/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/

import { getServiceRequestByID } from '../business_logic/serviceRequest/index.js';
export { getServiceRequestByIDController };

export const getRequestsAggregatedController = (prisma) => {
	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 * @param {import("express").NextFunction} next
	 **/
	return async (req, res, next) => {
		try {
			const requests = await prisma.serviceRequest.groupBy({
				by: ['serviceType', 'status', 'createdAt'],
				_count: { serviceType: true },
			});

			const aggregatedData = requests.reduce((acc, item) => {
				const date = new Date(item.createdAt);
				const year = date.getFullYear();
				const month = date.toLocaleString('default', { month: 'long' });
				//   console.log(date);

				if (!acc[year]) acc[year] = {};
				if (!acc[year][month]) {
					acc[year][month] = {
						Flight: {
							Submitted: 0,
							'In Progress': 0,
							Confirmed: 0,
							Completed: 0,
							Cancelled: 0,
							Rejected: 0,
						},
						Cab: {
							Submitted: 0,
							'In Progress': 0,
							Confirmed: 0,
							Completed: 0,
							Cancelled: 0,
							Rejected: 0,
						},
						Hotel: {
							Submitted: 0,
							'In Progress': 0,
							Confirmed: 0,
							Completed: 0,
							Cancelled: 0,
							Rejected: 0,
						},
					};
				}
				acc[year][month][item.serviceType][item.status] +=
					item._count.serviceType;

				return acc;
			}, {});

			const result = Object.entries(aggregatedData).map(
				([year, months]) => ({
					year,
					months: Object.entries(months).map(([month, data]) => ({
						month,
						...data,
					})),
				})
			);

			res.json(result);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch requests' });
		}
	};
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 **/
const getServiceRequestByIDController = (prisma) => {
	/**
	 * @param {import("express").Request}  req
	 * @param {import("express").Response}  res
	 * @param {import("express").NextFunction}  next
	 **/

	return async (req, res, next) => {
		try {
			const { id } = req.query;
			// const us = req.currentUser;
			const { empID } = req.query;
			console.log(id + ' ' + empID);
			const result = await getServiceRequestByID(id, empID, prisma);
			res.status(200).json(result);
		} catch (e) {
			next(e);
		}
	};
};
