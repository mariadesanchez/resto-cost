'use server';


import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const deleteOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return {
        ok: false,
        message: `${id} no existe`,
      };
    }

    if (session.user.role === 'user') {
      if (session.user.id !== order.userId) {
        return {
          ok: false,
          message: `${id} no es de ese usuario`,
        };
      } else {
        await prisma.order.delete({
          where: { id },
        });

        return {
          ok: true,
          message: 'Orden Eliminada Correctamente',
        };
      }
    }

    // Manejar otros casos si es necesario

  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'Error al eliminar la orden',
    };
  }
};