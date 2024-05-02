'use server';

import prisma from '@/lib/prisma';
import cloudinary from 'cloudinary';
import { redirect } from 'next/navigation';

// Configura Cloudinary (asegúrate de haber configurado tus credenciales)


export async function deleteProductById(id: string) {
  try {
    // Obtenemos las URLs de las imágenes asociadas al producto
    const productImages = await prisma.productImage.findMany({
      where: {
        productId: id,
      },
      select: {
        url: true,
      },
    });

    // Eliminamos las imágenes de Cloudinary
    const deleteResults = await Promise.all(productImages.map(async (image) => {
      const publicId = image.url.split('/').pop()?.split('.')[0]; // Obtén el public ID de la URL
      if (publicId) {
        return cloudinary.v2.uploader.destroy(publicId);
      }
    }));

    // Eliminamos las imágenes de la base de datos
    await prisma.$transaction([
      prisma.productImage.deleteMany({
        where: {
          productId: id,
        },
      }),
      prisma.product.delete({
        where: {
          id: id,
        },
      }),
    ]);

    redirect('/admin/products');
  } catch (error) {
    console.error('Error al eliminar el producto y sus imágenes:', error);
    throw error;
  }
}
