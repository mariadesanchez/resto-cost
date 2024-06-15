'use server';

import prisma from '@/lib/prisma';

export async function deleteMermaById({ id }: { id: string; }) {
    try {
        const mermaExistente = await prisma.merma.findUnique({
            where: { id: id },
        });

        if (!mermaExistente) {
            throw new Error(`Ingrediente con id ${id} no existe`);
        }

        await prisma.merma.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error('Error al eliminar el ingrediente:', error);
        throw new Error(`No se pudo eliminar el ingrediente con id ${id}`);
    }
}
