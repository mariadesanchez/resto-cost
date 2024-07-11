
'use server'
import prisma from "@/lib/prisma";

export const getProductsByCategory = async (category: string) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: {
          take: 2,
          select: {
            url: true,
          },
        },
        category: true,
      },
      where: {
        category: {
          name: category,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  } catch (error) {
    throw new Error("No se pudo cargar los productos");
  }
};
