'use server'
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema validation
const mermaSchema = z.object({
  precioActual: z.number().min(0).transform(val => Number(val.toFixed(2))),


});

// Action to update the precioActual of a merma
export const updateMermaPrice = async (mermaId: string, newPrice: number) => {
  try {
    const merma = await prisma.merma.update({
      where: { id: mermaId },
      data: {
        precioActual: newPrice,

      },
    });

    return { ok: true, merma };
  } catch (error) {
    console.error('Error updating merma price:', error);
    return { ok: false, message: 'Error updating merma' };
  }
};
