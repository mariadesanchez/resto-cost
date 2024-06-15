'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const mermaSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(255),
  porcentaje: z.number().min(0).max(100),
  precio: z.number().min(0).transform(val => Number(val.toFixed(2))),
  unidadMedida: z.enum(['miligramos', 'gramos', 'kilo', 'mililitros', 'litro', 'unidad'])
});

export const createUpdateMerma = async (formData: FormData) => {
  const data = Object.fromEntries(formData.entries());
  
  const parsedData = {
    ...data,
    porcentaje: parseFloat(data.porcentaje as string),
    precio: parseFloat(data.precio as string)
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
        // Actualizar
        merma = await prisma.merma.update({
          where: { id },
          data: { ...rest },
        });
      } else {
        // Crear
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
