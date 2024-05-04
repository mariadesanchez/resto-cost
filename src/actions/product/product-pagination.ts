"use server";

import prisma from "@/lib/prisma";
import { Plato } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  plato?: Plato;
}

export async function getPaginatedProductsWithImages({
  page = 1,
  take = 6,
  plato,
}: PaginationOptions){
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
      },
      //! Por plato
      where: {
        plato: plato,
      },
    });

    // 2. Obtener el total de páginas
    // todo:
    const totalCount = await prisma.product.count({
      where: {
        plato: plato,
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
