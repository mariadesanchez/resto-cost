
'use server';


import prisma from '@/lib/prisma';



export const IngredienteByProductId = async(productId:string) => {

 
    try {    
      const ingredientes = await prisma.ingrediente.findMany({
  
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

