'use server';

import prisma from '@/lib/prisma';

export async function deleteIngredienteById({ id }: { id: string; }) {
    try {
        const ingredienteExistente = await prisma.ingrediente.findUnique({
            where: { id: id },
        });

        if (!ingredienteExistente) {
            throw new Error(`Ingrediente con id ${id} no existe`);
        }

        await prisma.ingrediente.delete({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error('Error al eliminar el ingrediente:', error);
        throw new Error(`No se pudo eliminar el ingrediente con id ${id}`);
    }
}
