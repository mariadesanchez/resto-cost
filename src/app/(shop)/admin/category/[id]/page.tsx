
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { CategoryForm } from './ui/CategoryForm';
import prisma from '@/lib/prisma';

interface Props {
  params: {
    id: string;
  }
}



export default async function CategoryPage({ params }: Props) {

  const {id } = params;

  const category = await prisma.category.findFirst({
    
    where: {
      id: id,
    }
  })

  // Todo: new
  if ( !category && id !== 'new' ) {
    redirect('/admin/categories')
  }

  const title = (id === 'new') ? 'Nueva Categoría' : 'Editar Categoría'

  return (
    <>
      <Title title={ title } />

      <CategoryForm category={ category ?? {id:'',name:''} }  />
    </>
  );
}