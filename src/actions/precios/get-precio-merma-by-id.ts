
'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const mermaIdSchema = z.string().uuid();

export const getMermaById = async (id: string) => {
  const idValidation = mermaIdSchema.safeParse(id);

  if (!idValidation.success) {
    console.log('Invalid ID:', idValidation.error);
    return { ok: false, message: 'Invalid ID' };
  }

  try {
    const merma = await prisma.merma.findUnique({
      where: { id },
    });

    if (!merma) {
      return { ok: false, message: 'Merma not found' };
    }

    return {
      ok: true,
      merma,
    };
  } catch (error) {
    console.log('Error fetching Merma:', error);
    return {
      ok: false,
      message: 'Error fetching Merma',
    };
  }
};