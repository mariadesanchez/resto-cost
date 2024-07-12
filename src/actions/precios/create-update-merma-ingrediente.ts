'use server';
import { Merma } from '@/interfaces';
import prisma from '@/lib/prisma';


export const createUpdateMermaIngrediente = async (
  precioActual: number,
  name: string,
  mermaId?: string,
  productId?: string | null, // Permitir null
): Promise<{ ok: boolean; merma?: Merma; message?: string }> => {
  try {
    if (mermaId) {
      // Actualiza la merma existente
      const updatedMerma = await prisma.merma.update({
        where: { id: mermaId },
        data: {
          name,
          precioActual,
          ...(productId && { productId }), // Solo agrega productId si tiene valor
        },
      });
      return { ok: true, merma: updatedMerma };
    } else {
      // Crea un nuevo registro
      const data: any = {
        name,
        precioActual,
        ...(productId && { productId }), // Solo agrega productId si tiene valor
        unidadMedida: 'gramos', // Valor por defecto
        porcentaje: 0, // Valor por defecto
        cantidad: 0, // Valor por defecto
        precioUnitarioActual: precioActual, // O cualquier lógica que necesites
      };

      const newMerma = await prisma.merma.create({
        data,
      });

      return { ok: true, merma: newMerma };
    }
  } catch (error) {
    console.error('Error al crear o actualizar Merma:', error);
    return { ok: false, message: 'Error al crear o actualizar Merma.' };
  }
};

