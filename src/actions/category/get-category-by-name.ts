import prisma from '@/lib/prisma'; // Ajusta la ruta según tu estructura de proyecto

/**
 * Busca una categoría por su nombre y devuelve solo su ID.
 * @param name - El nombre de la categoría.
 * @returns El ID de la categoría correspondiente o null si no se encuentra.
 */
export async function getCategoryByName(name: string): Promise<string | null> {
  if (!name) {
    console.error('Category name is not defined');
    return null;
  }

  try {
    const category = await prisma.category.findUnique({
      where: {
        name:name
      },
      select: {
        id: true,
      },
    });
    return category ? category.id : null;
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return null;
  }
}
