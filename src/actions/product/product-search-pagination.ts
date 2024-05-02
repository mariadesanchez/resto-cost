"use server";

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  query: string;
}

export const getPaginatedProductsSearchWithImages = async ({
  page = 1,
  take = 6,
  query,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;
  // const productsSearch = await searchProductByTerm(query);
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
      },
      //! Por termino
      where: {
        OR: [{
            title: {
            contains: query,
            mode: "insensitive"
            }
        }, {
            description: {
            contains: query,
            mode: "insensitive"
            }
        }]
        }
     
      
    });

    // 2. Obtener el total de páginas
    // todo:
    const totalCount = await prisma.product.count({
      where: {
        OR: [{
            title: {
            contains: query,
            mode: "insensitive"
            }
        }, {
            description: {
            contains: query,
            mode: "insensitive"
            }
        }]
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
