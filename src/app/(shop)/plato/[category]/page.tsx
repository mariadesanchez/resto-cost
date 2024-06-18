
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
