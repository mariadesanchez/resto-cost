
'use server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const nameSchema = z.string().min(1).max(255);

export const getMermaByName = async (name: string): Promise<string | null> => {
  const nameValidation = nameSchema.safeParse(name);

  if (!nameValidation.success) {
    console.log('Invalid Name:', nameValidation.error);
    return null;
  }

  try {
    const merma = await prisma.merma.findFirst({
      where: { name: name },
    });

    if (!merma) {
      console.log('Merma not found');
      return null;
    }

    return merma.id;
  } catch (error) {
    console.log('Error fetching Merma:', error);
    return null;
  }
};
