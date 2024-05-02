export const revalidate = 60; // 60 segundos


import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';// import SearchComponent from '@/components/search/[query]/SearchComponent';



interface Props {
  searchParams: {
    page?: string; 
  }
}


export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt( searchParams.page ) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });


  if ( products.length === 0 ) {
    redirect('/');
  }


  return (
    <>
   

    <ProductGrid 
      products={products}
    />
  
    <Pagination totalPages={totalPages} />
  </>
  );
}
