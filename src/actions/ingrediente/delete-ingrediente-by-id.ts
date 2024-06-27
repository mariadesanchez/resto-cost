'use server';

import prisma from '@/lib/prisma';

export async function deleteIngredienteById({ id, productId }: { id: string; productId: string; }) {
    try {
        // Verificar si el ingrediente existe
        const ingredienteExistente = await prisma.ingrediente.findUnique({
            where: { id: id },
        });

        if (!ingredienteExistente) {
            throw new Error(`Ingrediente con id ${id} no existe`);
        }

        // Iniciar transacción
        await prisma.$transaction(async (tx) => {
            // Eliminar el registro de la tabla intermedia
            await tx.productIngrediente.delete({
                where: {
                    productId_ingredienteId: {
                        productId: productId,
                        ingredienteId: id,
                    },
                },
            });

            // Eliminar el ingrediente
            await tx.ingrediente.delete({
                where: {
                    id: id,
                },
            });
        });
    } catch (error) {
        console.error('Error al eliminar el ingrediente:', error);
        throw new Error(`No se pudo eliminar el ingrediente con id ${id}`);
    }
}
