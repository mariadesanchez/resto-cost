
'use server';


import prisma from '@/lib/prisma';



export async function IngredienteByProductId(productId:string){

 
    try {    
      const ingredientes = await prisma.ingrediente.findMany({
        where: {
          productId : productId,
          
      },
      orderBy: {
        name: 'asc'
        }
  
      });
      return ingredientes;
  
    } catch (error) {
      console.log(error);
      return [];
    }
  
  
  }

