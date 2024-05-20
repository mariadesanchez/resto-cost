"use server";
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Ingrediente } from '@prisma/client';
import { z } from 'zod';

const ingredienteSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  slug: z.string().min(3).max(255),
  name: z.string().min(3).max(255),
  cantidadReceta: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  precioConMerma: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(2))),
  cantidadConMerma: z.coerce
    .number()
    .min(0)
    .transform(val => Number(val.toFixed(0))),
  productId: z.string(),
  unidadMedida: z.enum(['miligramos', 'gramos', 'kilo', 'mililitros', 'litro', 'unidad'])
});

export async function createUpdateIngrediente(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  console.log("Parsed data:", data); // Añadir esta línea para depuración

  const ingredienteParsed = ingredienteSchema.safeParse(data);

  if (!ingredienteParsed.success) {
    console.log(ingredienteParsed.error);
    return { ok: false, errors: ingredienteParsed.error.format() };
  }

  const ingrediente = ingredienteParsed.data;
  ingrediente.slug = ingrediente.slug.toLowerCase().replace(/ /g, '-').trim();

  const { id, productId, ...rest } = ingrediente;

  // Verificar si el productId existe en la tabla Product
  const productExists = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productExists) {
    return {
      ok: false,
      message: 'El productId proporcionado no existe en la tabla Product.',
    };
  }

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      let ingrediente: Ingrediente;

      if (id) {
        // Actualizar
        ingrediente = await prisma.ingrediente.update({
          where: { id },
          data: {
            ...rest,
            productId, // Asegurar que se actualice con un productId válido
          }
        });
      } else {
        // Crear
        ingrediente = await prisma.ingrediente.create({
          data: {
            ...rest,
            productId, // Asegurar que se cree con un productId válido
          }
        });
      }

      return {
        ingrediente
      };
    });

    // RevalidatePaths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/ingrediente/${ingrediente.slug}`);
    revalidatePath(`/products/${ingrediente.slug}`);

    return {
      ok: true,
      ingrediente: prismaTx.ingrediente,
    };
  } catch (error) {
    console.error('Error creating/updating ingrediente:', error);
    return {
      ok: false,
      message: 'Revisar los logs, no se pudo actualizar/crear'
    };
  }
}
