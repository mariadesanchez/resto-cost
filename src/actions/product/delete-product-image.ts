'use server';

import prisma from '@/lib/prisma';
import {v2 as cloudinary} from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config( process.env.CLOUDINARY_URL ?? '' );


export const deleteProductImage = async (imageUrl: string) => {
  try {
    // Buscar la imagen basada en la URL antes de eliminarla
    const imageToDelete = await prisma.productImage.findFirst({
      where: {
        url: imageUrl
      }
    });

    if (!imageToDelete) {
      return {
        ok: false,
        message: 'La imagen no fue encontrada en la base de datos'
      };
    }

    // Eliminar la imagen de Cloudinary
    await cloudinary.uploader.destroy(imageUrl);

    // Eliminar la entrada correspondiente de la base de datos utilizando Prisma
    await prisma.productImage.delete({
      where: {
        id: imageToDelete.id
      }
    });


    const productSlug = await prisma.product.findFirst({
      where: {
        id: imageToDelete.productId
      }
    });
    // Revalidar los paths
    revalidatePath(`/admin/products`);
    revalidatePath(`/admin/product/${productSlug}`);
    revalidatePath(`/product/${productSlug}`);
    
    return {
      ok: true,
      message: 'La imagen ha sido eliminada correctamente'
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la imagen'
    };
  }
};
