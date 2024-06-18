'use server';

import prisma from '@/lib/prisma';

export const getMermas = async () => {
  try {
    const mermas = await prisma.merma.findMany();
    return {
      ok: true,
      mermas,
      orderBy: {
        name: 'asc'
      }
    };
  } catch (error) {
    console.log('Error fetching mermas:', error);
    return {
      ok: false,
      message: 'Error fetching mermas',
    };
  }
};
