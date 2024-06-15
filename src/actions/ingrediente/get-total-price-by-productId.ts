import prisma from '@/lib/prisma';

export async function getPricesWithMermaByProductId(productId: string) {
    try {
        const ingredients = await prisma.ingrediente.findMany({
            where: {
                productId: productId,
            },
            select: {
                precioConMerma: true
            },
        });

        // Calcula el precio total sumando los precios con merma de cada ingrediente
        const totalPrice = ingredients.reduce((total, ingredient) => {
            return total + ingredient.precioConMerma;
        }, 0);

        return totalPrice;
    } catch (error) {
        console.error("Error al obtener precios con merma por ID de producto:", error);
        throw new Error('Error al obtener precios con merma por ID de producto');
    }
}

  