import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';

interface Props {
  params: {
    slug: string;
  }
}



export default async function ProductPage({ params }: Props) {

  const { slug } = params;

  const [ product, categories ] = await Promise.all([
    getProductBySlug(slug),
    getCategories()
  ]);
 

  // Todo: new
  if ( !product && slug !== 'new' ) {
    redirect('/admin/elaboraciones')
  }

  const title = (slug === 'new') ? 'Nuevo plato' : 'Editar plato'

  return (
    <>
      <Title title={ title } />

      <ProductForm product={ product ?? {} } categories={ categories } />
    </>
  );
}