export const revalidate = 60; // 60 segundos

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';

import { Plato } from '@prisma/client';
import { redirect } from 'next/navigation';



interface Props {
 
  params: {
    plato: string;
  },
  searchParams: {
    page?: string; 
  }
}


export default async function PlatoByPage({ params, searchParams }: Props) {

  const { plato } = params;

  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page, 
    plato: plato as Plato,
  });


  if ( products.length === 0 ) {
    redirect(`/plato/${ plato }`);
  }
  

  const labels: Record<string, string>  = {
    'carne': 'carne',
    'pastas': 'pastas',
    'kid': 'Menú infantil',
    'vegetales': 'vegetales de estación',
    'pescados': 'pescados frescos'
   
    
  }

  

  return (
    <>
      <Title
        title={` ${ labels[plato] }`}
        // subtitle="Todos los productos"
        className="mb-2, text-xs"
      />

      <ProductGrid 
      products={products}
        // products={ products }
      />

      <Pagination totalPages={ totalPages }  />
      
    </>
  );
}