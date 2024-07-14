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
  const { id } = params;

  const category = await prisma.category.findFirst({
    where: {
      id: id,
    }
  });

  // Redirige si la categoría no se encuentra y el ID no es 'new'
  if (!category && id !== 'new') {
    redirect('/admin/categories');
  }

  const title = (id === 'new') ? 'Nueva Categoría' : 'Editar Categoría';

  // Si no se encuentra una categoría y el ID es 'new', crea una categoría vacía
  const categoryData = category ?? { id: '', name: '' };

  return (
    <>
      <Title title={title} />
      <CategoryForm category={categoryData} />
    </>
  );
}
