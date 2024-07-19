import { getMermaById } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { MermaForm } from './ui/MermaForm';
import { Merma } from "@/interfaces";

interface Props {
  params: {
    id: string;
  }
}

export default async function IngredientPage({ params }: Props) {
  const { id } = params;

  const { ok, merma } = await getMermaById(id);

  // Redirige si no se encuentra la merma y no es una nueva creación
  if (!ok && id !== 'new') {
    redirect('/admin/listPrice');
    return; // Asegúrate de detener la ejecución después de la redirección
  }

  // Proporciona un valor predeterminado si merma es null
  const defaultMerma: Merma = {
    id: '',
    name: '',
    unidadMedida: 'gramos',
    porcentaje: 0,
    precioActual: 0,
    cantidad: 0,
    precioUnitarioActual: 0,
    productId: null
  };

  const mermaToPass: Merma = merma || defaultMerma;

  const title = (id === 'new') ? 'Nuevo Ingrediente' : 'Editar Ingrediente';

  return (
    <>
      <Title title={title} />
      <MermaForm merma={mermaToPass} />
    </>
  );
}
