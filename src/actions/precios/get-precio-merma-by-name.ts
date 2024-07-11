
'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';

const nameSchema = z.string().min(1).max(255);

export const getMermaByName = async (name: string) => {
  const nameValidation = nameSchema.safeParse(name);

  if (!nameValidation.success) {
    console.log('Invalid Name:', nameValidation.error);
    return { ok: false, message: 'Invalid Name' };
  }

  try {
    const merma = await prisma.merma.findFirst({
      where: { name: name },
    });

    if (!merma) {
      return { ok: false, message: 'Merma not found' };
    }

    return {
      ok: true,
      id: merma.id,
    };
  } catch (error) {
    console.log('Error fetching Merma:', error);
    return {
      ok: false,
      message: 'Error fetching Merma',
    };
  }
};


