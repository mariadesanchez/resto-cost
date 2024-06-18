'use server';

import prisma from '@/lib/prisma';

export async function updateIngredientesByMerma(name:any, adjustmentFactor:any) {
  try {
    const ingredientes = await prisma.ingrediente.findMany({
      where: { name: name },
    });

    if (!ingredientes || ingredientes.length === 0) {
      return { ok: false, message: 'No se encontraron ingredientes con ese nombre' };
    }

    const updatedIngredientes = await prisma.$transaction(
      ingredientes.map((ingrediente) => {
        const nuevoPrecioConMerma = ingrediente.precioConMerma * adjustmentFactor;
        return prisma.ingrediente.update({
          where: { id: ingrediente.id },
          data: { precioConMerma: nuevoPrecioConMerma },
        });
      })
    );

    return { ok: true, updatedIngredientes };
  } catch (error) {
    console.error('Error al actualizar ingredientes:', error);
    return { ok: false, message: 'Error al actualizar ingredientes' };
  }
}
