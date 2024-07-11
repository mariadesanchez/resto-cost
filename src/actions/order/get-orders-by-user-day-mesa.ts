'use server';
import prisma from '@/lib/prisma';

export async function getOrdersByUserByDayByMesa(mesa: string) {
  try {
    const orders = await prisma.order.findMany({
      where: { mesa },
      include: {
        OrderItem: {
          include: {
            product: true, // Esto incluye los datos del producto
          },
        },
      },
    });
    return { ok: true, orders };
  } catch (error) {
    console.error(error);
    return { ok: false, orders: [] };
  }
}
