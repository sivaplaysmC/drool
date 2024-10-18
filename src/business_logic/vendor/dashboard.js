
/**
 * @param {number} pagenum 
 * @param {import("@prisma/client").PrismaClient} prisma
 * @returns {Promise<Array<Object>>} 
 */
const getVendorsPaginated = async (pagenum, prisma) => {
    const pageSize = 10;
    const offset = (pagenum - 1) * pageSize;
  
    return await prisma.vendors.findMany({
      skip: offset,
      take: pageSize,
    });
  };
  
  export default getVendorsPaginated;
  