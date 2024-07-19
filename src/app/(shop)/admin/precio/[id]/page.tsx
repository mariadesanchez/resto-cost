import { getMermaById } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { IngredientForm } from './ui/IngredientForm';
import { Ingrediente } from "@/interfaces";

interface Props {
  params: {
    id: string;
  }
}

export default async function IngredientPage({ params }: Props) {
  const { id } = params;

  const { ok, merma } = await getMermaById(id);

  // Redirigir si no se encuentra el ingrediente y no es una nueva creación
  if (!ok && id !== 'new') {
    redirect('/admin/listPrice');
  }

  const ingredient: Ingrediente = ok && merma ? merma : {
    id: '',
    name: '',
    unidadMedida: 'gramos',
    porcentaje: 0,
    precioActual: 0,
    cantidad: 0,
    precioUnitarioActual: 0
  };

  const title = (id === 'new') ? 'Nuevo Ingrediente' : 'Editar Ingrediente';

  return (
    <>
      <Title title={title} />
      <IngredientForm ingredient={ingredient} />
    </>
  );
}

