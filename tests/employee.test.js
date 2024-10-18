import sinon from 'sinon';
import { sendEmail, verifyOtp } from '../src/business_logic/employee/login.js'; // Replace with your actual module path

import { getServiceRequestDetailsPaginated } from '../src/business_logic/employee/dashboard.js';

import { getServiceRequestDetailsByID } from '../src/business_logic/employee/serviceRequestDetails.js';

import jwt from 'jsonwebtoken';

import * as chai from 'chai';
const expect = chai.expect;

describe('Service Request Functions', () => {
	let prismaMock, resendMock, genOtpMock;

	beforeEach(() => {
		prismaMock = {
			serviceRequest: {
				findMany: sinon.stub(),
				findUnique: sinon.stub(),
			},
			user: {
				findUnique: sinon.stub(),
			},
			otp: {
				findFirst: sinon.stub(),
				delete: sinon.stub(),
				create: sinon.stub(),
			},
			employee: {
				findUnique: sinon.stub(),
			},
		};

		resendMock = {
			emails: {
				send: sinon.stub(),
			},
		};

		genOtpMock = sinon.stub();
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('getServiceRequestDetailsPaginated', () => {
		it('should return paginated service request details for an employee', async () => {
			const mockUser = { userType: 'EMPLOYEE', employee: { ID: 123 } };
			const mockDetails = [{ ID: 1 }, { ID: 2 }];

			prismaMock.serviceRequest.findMany.resolves(mockDetails);

			const result = await getServiceRequestDetailsPaginated(
				1,
				mockUser,
				prismaMock
			);

			expect(prismaMock.serviceRequest.findMany.calledOnce).to.be.true;
			expect(result).to.deep.equal(mockDetails);
			expect(
				prismaMock.serviceRequest.findMany.firstCall.args[0].where
					.employeeID
			).to.equal(mockUser.employee.ID);
		});

		it('should return paginated service request details for non-employee user', async () => {
			const mockUser = { userType: 'ADMIN' };
			const mockDetails = [{ ID: 1 }, { ID: 2 }];

			prismaMock.serviceRequest.findMany.resolves(mockDetails);

			const result = await getServiceRequestDetailsPaginated(
				1,
				mockUser,
				prismaMock
			);

			expect(prismaMock.serviceRequest.findMany.calledOnce).to.be.true;
			expect(result).to.deep.equal(mockDetails);
		});
	});

	describe('sendEmail', () => {
		it('should throw error if user is not found', async () => {
			prismaMock.user.findUnique.resolves(null);

			try {
				await sendEmail(
					'nonexistent@example.com',
					prismaMock,
					resendMock,
					genOtpMock
				);
			} catch (error) {
				expect(error).to.be.an('error');
			}
		});
	});

	describe('verifyOtp', () => {
		it('should verify OTP and generate JWT', async () => {
			const mockOtp = '123456';
			const mockOtpEntry = { userID: 123 };
			const mockUser = { ID: 123, name: 'John Doe' };
			const mockEmployee = { employeeID: 456 };

			prismaMock.otp.findFirst.resolves(mockOtpEntry);
			prismaMock.user.findUnique.resolves(mockUser);
			prismaMock.employee.findUnique.resolves(mockEmployee);
			prismaMock.otp.delete.resolves();

			const jwtMock = sinon.stub(jwt, 'sign').returns('mockedJwt');

			const result = await verifyOtp(mockOtp, prismaMock);

			expect(prismaMock.otp.findFirst.calledOnce).to.be.true;
			expect(prismaMock.otp.delete.calledOnce).to.be.true;
			expect(jwtMock.calledOnce).to.be.true;
			expect(result).to.equal('mockedJwt');
		});

		it('should throw error if OTP is invalid', async () => {
			prismaMock.otp.findFirst.resolves(null);

			try {
				await verifyOtp('invalidOtp', prismaMock);
			} catch (error) {
				expect(error).to.be.an('error');
			}
		});
	});

	describe('getServiceRequestDetailsByID', () => {
		it('should return service request details by ID', async () => {
			const mockRequestID = 'req123';
			const mockEmpID = 123;
			const mockServiceRequest = { ID: mockRequestID };

			prismaMock.serviceRequest.findUnique.resolves(mockServiceRequest);

			const result = await getServiceRequestDetailsByID(
				mockRequestID,
				mockEmpID,
				prismaMock
			);

			expect(prismaMock.serviceRequest.findUnique.calledOnce).to.be.true;
			expect(result).to.deep.equal(mockServiceRequest);
		});

		it('should throw error if service request details cannot be fetched', async () => {
			prismaMock.serviceRequest.findUnique.rejects(new Error('DB Error'));

			try {
				await getServiceRequestDetailsByID(
					'invalidID',
					123,
					prismaMock
				);
			} catch (error) {
				expect(error.message).to.equal(
					'Could not fetch service request details.'
				);
			}
		});
	});
});
