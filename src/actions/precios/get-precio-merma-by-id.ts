// src/actions/getMermaById.ts
'use server'
// src/actions/getMermaById.ts
import prisma from '@/lib/prisma';

export async function getMermaById(id: string) {
  try {
    const merma = await prisma.merma.findUnique({
      where: { id },
    });
    return { ok: true, merma };
  } catch (error) {
    console.error('Error al obtener la merma por ID:', error);
    return { ok: false, merma: null };
  }
}

