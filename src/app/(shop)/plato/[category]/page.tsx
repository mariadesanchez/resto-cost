// 'use client'
// // export const revalidate = 60; // 60 segundos

// import { getPaginatedProductsWithImages,getCategoryByName } from '@/actions';
// import { Pagination, ProductGrid, Title } from '@/components';
// import { redirect } from 'next/navigation';
// import { useState } from 'react';

// interface Props {
//   params: {
//     plato: string;
//   },
//   searchParams: {
//     page?: string; 
//   }
// }

// export default async function GenderByPage({ params, searchParams }: Props) {
//   const [productsPlato, setProductsPlato] = useState([{}]);
//   const { plato } = params; // Aquí se accede al parámetro dinámico 'plato'
//   const page = searchParams.page ? parseInt(searchParams.page) : 1;

//   const categoryId = await getCategoryByName(plato);

//   if (categoryId === null) {
    
//     redirect(`/`);
//     return null;
//   }

//   const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ 
//     page, 
//     category: categoryId, // Aquí pasamos el ID como string
//   });

//   if (products.length !== 0) {
//    setProductsPlato(products)
//   }


//   return (
//     <>
//     <Title title={` ${plato}`} className="mb-2" />
//     <ProductGrid products={products} />
//     <Pagination totalPages={totalPages} />
//   </>
//   );
// }
// PlatoByPage.tsx
import { getPaginatedProductsWithImages, getCategoryByName } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';

interface Props {
  params: {
    category: string;
  },
  searchParams: {
    page?: string; 
  }
}

export default async function PlatoByPage({ params, searchParams }: Props) {
  const { category } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  // Obtener el ID de la categoría por su nombre
  let categoryId: string | undefined;
  try {
    categoryId = await getCategoryByName(category);
    console.log(categoryId)
  } catch (error) {
    console.error(error);
    redirect('/404'); // Redirigir a una página 404 si la categoría no se encuentra
    return;
  }

  if (!categoryId) {
    redirect('/404'); // Redirigir si no hay un ID de categoría
    return;
  }

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
    page, 
    category: categoryId,
  });

  if (products.length === 0) {
    redirect(`/plato/${category}`);
  }

  return (
        <>
        <Title title={` ${category}`} className="mb-2" />
        <ProductGrid products={products} />
        <Pagination totalPages={totalPages} />
      </>
      );
}
