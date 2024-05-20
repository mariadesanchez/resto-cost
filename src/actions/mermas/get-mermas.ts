'use server';

import prisma from '@/lib/prisma';

export async function getMermas(){
  try {    
    const mermas = await prisma.merma.findMany({

      orderBy: {
      name: 'asc'
      }

    });
    return mermas;

  } catch (error) {
    console.log(error);
    return [];
  }


}