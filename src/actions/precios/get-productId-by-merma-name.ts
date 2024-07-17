
'use server';
import prisma from '@/lib/prisma';

export const getProductIdByMermaName = async (name: string): Promise<string | null> => {
  try {
    const merma = await prisma.merma.findFirst({
      where: { name },
    });

    if (!merma) {
      console.log('Merma not found');
      return null;
    }

    return merma.productId;
  } catch (error) {
    console.log('Error fetching Merma:', error);
    return null;
  }
};
