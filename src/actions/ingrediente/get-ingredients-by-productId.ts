'use server';

import prisma from '@/lib/prisma';

export async function getIngredientsByProductId(productId: string) {
  try {
    const productIngredients = await prisma.productIngrediente.findMany({
      where: {
        productId: productId,
      },
      include: {
        ingrediente: true,  // Incluir los detalles completos del ingrediente
      },
    });

    // Extraer solo la parte del ingrediente de cada entrada en la tabla productIngrediente
    const ingredients = productIngredients.map(pi => pi.ingrediente);

    return ingredients;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener ingredientes por ID de producto');
  }
}

