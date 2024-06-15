
'use server';


import prisma from '@/lib/prisma';

export async function getIngredientsByProductId(productId: string) {
  try {
    const ingredients = await prisma.ingrediente.findMany({
      where: {
        productId: productId,
      },
    });

    return ingredients;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener ingredientes por ID de producto');
  }
}
