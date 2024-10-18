
/**
 * @param {string} vendorID 
 * @param {import("@prisma/client").PrismaClient} prisma
 * @returns {Promise<Object>} 
 */
const getVendorByID = async (vendorID, prisma) => {
    return await prisma.vendors.findUnique({
      where: {
        ID: vendorID,
      },
    });
  };
  
  export default getVendorByID;
  