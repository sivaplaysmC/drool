
/**
 * @param {import("@prisma/client").PrismaClient} prisma
 * @param {Object} vendorData 
 * @returns {Promise<Object>} 
 */
const createVendor = async (vendorData, prisma) => {
    try {
        const newVendor = await prisma.vendors.create({
            data: vendorData,
        });
        return newVendor;
    } catch (error) {
        throw new Error(`Error creating vendor: ${error.message}`);
    }
};

export { createVendor };
