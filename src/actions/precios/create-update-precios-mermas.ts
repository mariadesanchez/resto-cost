'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema validation
const mermaSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(255),
  cantidad: z.number().min(0).transform(val => Number(val.toFixed(2))),
  porcentaje: z.number().min(0).max(100),
  precioAnterior: z.number().min(0).transform(val => Number(val.toFixed(2))),
  precioActual: z.number().min(0).transform(val => Number(val.toFixed(2))),
  precioUnitarioActual: z.number().min(0).transform(val => Number(val.toFixed(2))),
  unidadMedida: z.enum(['miligramos', 'gramos', 'kilo', 'mililitros', 'litro', 'unidad'])
});

export const createUpdateMerma = async (formData: any[] | FormData) => {
  const data = Object.fromEntries(formData.entries());
  
  const parsedData = {
    ...data,
    cantidad: parseFloat(data.cantidad),
    porcentaje: parseFloat(data.porcentaje),
    precioAnterior: parseFloat(data.precioAnterior),
    precioActual: parseFloat(data.precioActual),
    precioUnitarioActual: parseFloat(data.precioUnitarioActual)
  };

  const mermaParsed = mermaSchema.safeParse(parsedData);

  if (!mermaParsed.success) {
    console.log(mermaParsed.error);
    return { ok: false, errors: mermaParsed.error.format() };
  }

  const merma = mermaParsed.data;
  const { id, ...rest } = merma;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let merma;
      if (id) {
        // Update
        merma = await prisma.merma.update({
          where: { id },
          data: { ...rest },
        });
      } else {
        // Create
        merma = await prisma.merma.create({
          data: { ...rest },
        });
      }
      return { merma };
    });

    // Revalidate paths if needed
    // e.g., revalidatePath('/admin/mermas');

    return {
      ok: true,
      merma: prismaTx.merma,
     
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Revisar los logs, no se pudo actualizar/crear',
    };
  }
};
