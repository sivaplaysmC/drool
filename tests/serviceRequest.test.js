import * as chai from 'chai';
import sinon from 'sinon';
import {
	createServiceRequest,
	deleteServiceRequest,
	getServiceRequestByID,
} from '../src/business_logic/serviceRequest/index.js';

const expect = chai.expect;

describe('Service Request Business Logic Tests', () => {
	let prismaMock, generateSRIDMock;

	beforeEach(() => {
		prismaMock = {
			serviceRequest: {
				create: sinon.stub(),
				findUnique: sinon.stub(),
				delete: sinon.stub(),
			},
			flightRequest: {
				create: sinon.stub(),
				delete: sinon.stub(),
			},
			cabRequest: {
				create: sinon.stub(),
				delete: sinon.stub(),
			},
			hotelRequest: {
				create: sinon.stub(),
				delete: sinon.stub(),
			},
		};

		generateSRIDMock = sinon.stub();
	});

	afterEach(() => {
		sinon.restore();
	});

	// Test for createServiceRequest
	describe('createServiceRequest', () => {
		it('should create a new service request and related entry', async () => {
			const inputData = {
				employeeID: 1,
				firstName: 'John',
				lastName: 'Doe',
				department: 'IT',
				mobileNumber: '1234567890',
				reasonForTravel: 'Business Trip',
				hodApprovalAttachment: 'attachment.pdf',
				serviceType: 'flight',
				additionalDetails: { flightNumber: 'XY123' },
			};

			const mockServiceRequestID = 'SR123';
			generateSRIDMock.returns(mockServiceRequestID);

			prismaMock.serviceRequest.create.resolves({
				ID: mockServiceRequestID,
			});
			prismaMock.flightRequest.create.resolves();

			const result = await createServiceRequest(
				prismaMock,
				generateSRIDMock,
				inputData
			);

			expect(generateSRIDMock.calledOnce).to.be.true;
			expect(prismaMock.serviceRequest.create.calledOnce).to.be.true;
			expect(prismaMock.flightRequest.create.calledOnce).to.be.true;
			expect(result.status).to.equal('ok');
		});

		it('should throw error for invalid service type', async () => {
			const inputData = {
				employeeID: 1,
				firstName: 'John',
				lastName: 'Doe',
				serviceType: 'invalid',
				additionalDetails: {},
			};

			try {
				await createServiceRequest(
					prismaMock,
					generateSRIDMock,
					inputData
				);
			} catch (error) {
				expect(error.message).to.equal('indvalID service request');
			}
		});
	});

	// Test for deleteServiceRequest
	describe('deleteServiceRequest', () => {
		it('should delete a service request and its related entries', async () => {
			const mockServiceRequest = {
				ID: 'SR123',
				employeeID: 1,
				serviceType: 'Flight',
			};

			prismaMock.serviceRequest.findUnique.resolves(mockServiceRequest);
			prismaMock.flightRequest.delete.resolves();
			prismaMock.serviceRequest.delete.resolves();

			await deleteServiceRequest('SR123', 1, prismaMock);

			expect(prismaMock.serviceRequest.findUnique.calledOnce).to.be.true;
			expect(prismaMock.flightRequest.delete.calledOnce).to.be.true;
			expect(prismaMock.serviceRequest.delete.calledOnce).to.be.true;
		});

		it('should handle missing service request', async () => {
			prismaMock.serviceRequest.findUnique.resolves(null);

			try {
				await deleteServiceRequest('SR123', 1, prismaMock);
			} catch (error) {
				expect(error).to.be.an('error');
			}
		});
	});

	// Test for getServiceRequestByID
	describe('getServiceRequestByID', () => {
		it('should return service request details by ID', async () => {
			const mockServiceRequest = {
				ID: 'SR123',
				employeeID: 1,
				CabRequest: {},
				FlightRequest: {},
				HotelRequest: {},
				confirmations: [],
				employee: {
					user: { name: 'John Doe' },
				},
			};

			prismaMock.serviceRequest.findUnique.resolves(mockServiceRequest);

			const result = await getServiceRequestByID('SR123', 1, prismaMock);

			expect(prismaMock.serviceRequest.findUnique.calledOnce).to.be.true;
			expect(result).to.deep.equal(mockServiceRequest);
		});

		it('should handle service request not found', async () => {
			prismaMock.serviceRequest.findUnique.resolves(null);

			const result = await getServiceRequestByID('SR123', 1, prismaMock);

			expect(result).to.be.null;
		});
	});
});
