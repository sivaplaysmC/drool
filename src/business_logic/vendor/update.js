
/**
 * @param {string} vendorID 
 * @param {Object} vendorData 
 * @param {import("@prisma/client").PrismaClient} prisma
 * @returns {Promise<Object>} 
 */
const updateVendor = async (vendorID, vendorData, prisma) => {
    try {
        const updatedVendor = await prisma.vendors.update({
            where: {
                ID: vendorID, 
            },
            data: vendorData, 
        });
        return updatedVendor;
    } catch (error) {
        throw new Error(`Error updating vendor: ${error.message}`);
    }
};

export default updateVendor;
