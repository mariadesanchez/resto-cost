'use server';
import { Merma } from '@/interfaces';
import prisma from '@/lib/prisma';


export const createUpdateMermaIngrediente = async (
  precioActual: number,
  name: string,
  mermaId?: string // mermaId es opcional
): Promise<{ ok: boolean; merma?: Merma; message?: string }> => {
  try {
    if (mermaId) {
      // Intenta actualizar la merma existente
      const updatedMerma = await prisma.merma.update({
        where: { id: mermaId },
        data: {
          name,
          precioActual,
          // Actualiza otros campos si es necesario
        },
      });

      return { ok: true, merma: updatedMerma };
    } else {
      // Si no se encuentra el mermaId, crea un nuevo registro
      const newMerma = await prisma.merma.create({
        data: {
          name,
          precioActual,
          // Asigna valores predeterminados para otros campos si es necesario
          unidadMedida: 'gramos', // Por ejemplo
          porcentaje: 0, // Valor predeterminado
          cantidad: 0, // Valor predeterminado
          precioUnitarioActual: precioActual, // O cualquier lógica que necesites
        },
      });

      return { ok: true, merma: newMerma };
    }
  } catch (error) {
    console.error('Error al crear o actualizar Merma:', error);
    return { ok: false, message: 'Error al crear o actualizar Merma.' };
  }
};

