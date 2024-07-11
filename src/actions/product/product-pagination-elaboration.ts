import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  category?: string; // El ID de la categoría como string (UUID)
}

export const getPaginatedProductsWithImagesElaboration = async ({
  page = 1,
  take = 6,
  category,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los productos
    const products = await prisma.product.findMany({
      take: take,
      skip: (page - 1) * take,
      include: {
        images: {
          take: 2,
          select: {
            url: true,
          },
        },
        category: true, // Incluimos la categoría para poder filtrar por nombre
      },
      where: {
        categoryId: category,
       
          category: {
            name: 'Elaboraciones', // Excluir productos cuya categoría sea "Elaboraciones"
          },
        
      },
    });

    // 2. Obtener el total de páginas
    const totalCount = await prisma.product.count({
      where: {
        categoryId: category,
   
          category: {
            name: 'Elaboraciones', // Excluir productos cuya categoría sea "Elaboraciones"
          },
        
      },
    });

    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.images.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error("No se pudo cargar los productos");
  }
};

