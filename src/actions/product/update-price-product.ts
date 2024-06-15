'use server';

import prisma from '@/lib/prisma';
export const updateProductPrice = async (productId: string, newPrice: number) => {
    try {
      // Buscar el producto por su ID
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
  
      // Verificar si el producto existe
      if (!existingProduct) {
        throw new Error(`Producto con ID ${productId} no encontrado`);
      }
  
      // Actualizar solo el precio del producto
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: { price: newPrice },
      });
  
      // Devolver el producto actualizado
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el precio del producto:", error);
      throw new Error('Error al actualizar el precio del producto');
    }
  };
  