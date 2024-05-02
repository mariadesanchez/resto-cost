
export const revalidate = 60; // 60 segundos
import { useEffect } from 'react';
import { getPaginatedProductsSearchWithImages } from '@/actions/product/product-search-pagination';
import { Pagination, ProductGrid, Title } from '@/components';

// import { Gender } from '@prisma/client';
import { redirect } from 'next/navigation';



interface Props {
  params: {
    query: string;
  },
  searchParams: {
    page?: string; 
  }
}


export default async function QueryByPage({ params, searchParams }: Props) {

  const { query } = params;

  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsSearchWithImages({ 
    page, 
    query,
  });


  if ( products.length === 0 ) {
   
    
    redirect('/');
  }
  
  return (
    <>
     

      <ProductGrid 
        products={ products }
      />

      <Pagination totalPages={ totalPages }  />
      
    </>
  );
}