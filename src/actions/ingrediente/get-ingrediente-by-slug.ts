'use server';

import prisma from '@/lib/prisma';


export async function getIngredienteBySlug( slug: string ){


  try {

    const ingrediente = await prisma.ingrediente.findFirst({
     
      where: {
        slug: slug,
      }
    })


    if ( !ingrediente ) return null;

    return {
      ingrediente
     
    };

    
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener producto por slug');
  }



}
