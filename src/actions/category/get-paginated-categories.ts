"use server";

import prisma from "@/lib/prisma";
// import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  // gender?: Gender;
}

export const getPaginatedCategories = async ({
  page = 1,
  take = 12,
  // gender,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  try {
    // 1. Obtener los productos
    const categories = await prisma.category.findMany({
      take: take,
      skip: (page - 1) * take,
      // include: {
      //   ProductImage: {
      //     take: 2,
      //     select: {
      //       url: true,
      //     },
      //   },
      // },
      //! Por género
      // where: {
      //   gender: gender,
      // },
    });

    // 2. Obtener el total de páginas
    // todo:
    const totalCount = await prisma.product.count({
     
    });
    
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      categories: categories.map((category) => ({
        ...category,
        // images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    throw new Error("No se pudo cargar los productos");
  }
};
