import prisma from '@/lib/prisma';

export async function getPricesWithMermaByProductId(productId: string) {
    try {
        const ingredients = await prisma.productIngrediente.findMany({
            where: {
                productId: productId,
            },
            include: {
                ingrediente: true,  // Incluir los detalles completos del ingrediente
            },
        });

        // Calcula el precio total sumando los precios con merma de cada ingrediente
        const totalPrice = ingredients.reduce((total, ingredient) => {
            return total + ingredient.ingrediente.precioConMerma;
        }, 0);

        return totalPrice;
    } catch (error) {
        console.error("Error al obtener precios con merma por ID de producto:", error);
        throw new Error('Error al obtener precios con merma por ID de producto');
    }
}
