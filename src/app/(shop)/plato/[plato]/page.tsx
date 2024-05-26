'use client'
// export const revalidate = 60; // 60 segundos

import { getPaginatedProductsWithImages,getCategoryByName } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';
import { useState } from 'react';

interface Props {
  params: {
    plato: string;
  },
  searchParams: {
    page?: string; 
  }
}

export default async function GenderByPage({ params, searchParams }: Props) {
  const [productsPlato, setProductsPlato] = useState([{}]);
  const { plato } = params; // Aquí se accede al parámetro dinámico 'plato'
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const categoryId = await getCategoryByName(plato);

  if (categoryId === null) {
    
    redirect(`/`);
    return null;
  }

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
    page, 
    category: categoryId, // Aquí pasamos el ID como string
  });

  if (products.length !== 0) {
   setProductsPlato(products)
  }


  return (
    <>
    <Title title={` ${plato}`} className="mb-2" />
    <ProductGrid products={products} />
    <Pagination totalPages={totalPages} />
  </>
  );
}
