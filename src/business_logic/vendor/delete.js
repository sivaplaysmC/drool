
/**
 * @param {string} vendorID 
 * @param {import("@prisma/client").PrismaClient} prisma
 * @returns {Promise<Object>} 
 */
const deleteVendor = async (vendorID, prisma) => {
    try {
        return await prisma.vendors.delete({
            where: {
                ID: vendorID,
            },
        });
    } catch (error) {
        throw new Error(`Failed to delete vendor with ID ${vendorID}: ${error.message}`);
    }
};

  
  export default deleteVendor;
  