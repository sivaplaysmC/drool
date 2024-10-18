// controllers/vendorController.js
import {
    createVendor,
    deleteVendor,
    getVendorByID,
    getVendorsPaginated,
} from '../business_logic/vendor/index.js';
import updateVendor from '../business_logic/vendor/update.js';

export {
    createVendorController,
    deleteVendorController,
    getVendorByIDController,
    getVendorsPaginatedController,
    updateVendorController
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
// controllers/vendorController.js

const createVendorController = (prisma) => {
    return async (req, res, next) => {
        const {
            ID,
            name,
            contact_no,
            pan,
            tan,
            bank_name,
            bank_beneficiary_name,
            email,
            registered_address,
            gst_number,
            msme_number,
            msme_certificate,
            cancelled_cheque,
            credit_period,
            service,
            place_of_supply,
        } = req.body;

        try {
            const vendorData = {
                ID,
                name,
                contact_no,
                pan,
                tan,
                bank_name,
                bank_beneficiary_name,
                email,
                registered_address,
                gst_number,
                msme_number,
                msme_certificate,
                cancelled_cheque,
                credit_period,
                service,
                place_of_supply,
            };

            const result = await createVendor(vendorData, prisma);
            res.status(201).json(result);
        } catch (error) {
            // Log the error for debugging
            console.error(error);
            res.status(500).json({ error: error.message }); // Send a more detailed error message
        }
    };
};

// Similarly modify other controller functions

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
const deleteVendorController = (prisma) => {
    return async (req, res, next) => {
        const { vendorID } = req.body;

        try {
            const result = await deleteVendor(vendorID, prisma);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error deleting vendor:', error); // Log the error
            res.status(400).json({ error: error.message || 'An error occurred while deleting the vendor.' }); // Provide a more informative response
        }
    };
};


/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
const getVendorByIDController = (prisma) => {
    return async (req, res, next) => {
        try {
            const { vendorID } = req.body;

            const result = await getVendorByID(vendorID, prisma);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
};

/**
 * @param {import("@prisma/client").PrismaClient} prisma
 */
const getVendorsPaginatedController = (prisma) => {
    return async (req, res, next) => {
        try {
            const { pagenum } = req.params;

            const result = await getVendorsPaginated(pagenum, prisma);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
};

const updateVendorController = (prisma) => {
    return async (req, res, next) => {
        const { vendorID, ...vendorData } = req.body; // Get vendorID and vendor data from the body

        try {
            const result = await updateVendor(vendorID, vendorData, prisma);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
};

