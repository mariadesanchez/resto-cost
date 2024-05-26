'use server';

import prisma from '@/lib/prisma';

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // Generar el slug a partir del nombre de la categoría
    return categories.map((category) => ({
      ...category,
      slug: category.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}
