'use client';
import React, { useCallback, useEffect, useState } from "react";
import { getMermaByName, createUpdateMermaIngrediente, getIngredientsByProductId } from "@/actions";
import { useRouter } from 'next/navigation';
import { DeleteIngrediente } from "@/components";
import { UnidadMedida } from "@prisma/client";

interface Props {
  slug: string;
  name: string;
  total: number;
}
//En este componente vamos mostrando los ingredientes que vamos agregando
//al producto, podemos eliminar, volver a agregar algun Ingrediente
//Si llegara a ser una Elaboracion, tendria que visibilizarse el boton
//Enviar a Ingrediente/s, 
export default function IngredientePage({ slug, name, total }: Props) {
 
  const router = useRouter();
  const [mermaId, setMermaId] = useState('');

  const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; }[]>([]);

  console.log('Received props:', { slug, name, total });

  const fetchIngredientesByProductId = useCallback(async () => {
    try {
      const ingredientesByProductId = await getIngredientsByProductId(slug);
      setIngredientesByProduct(ingredientesByProductId);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  }, [slug, total]);

  useEffect(() => {
    fetchIngredientesByProductId();
  }, [fetchIngredientesByProductId]);
//Actualizar o Crear Merma, si llegara a ser una Elaboracion
  const handleUpdateMerma = async () => {
    if (name) {
      const fetchedMermaId = await getMermaByName(name);
      let result;

      if (fetchedMermaId) {
        setMermaId(fetchedMermaId);
        // Actualiza la merma existente
        result = await createUpdateMermaIngrediente(total, name, fetchedMermaId, slug);
        if (result.ok) {
          console.log('MermaIngrediente actualizado correctamente:', result.merma);
        } else {
          console.error('Error al actualizar MermaIngrediente:', result.message);
        }
      } else {
        console.log('Merma no encontrada para el producto:', name);
        // Crea un nuevo registro si no se encuentra
        result = await createUpdateMermaIngrediente(total, name);
        if (result.ok) {
          console.log('MermaIngrediente creado correctamente:', result.merma);
        } else {
          console.error('Error al crear MermaIngrediente:', result.message);
        }
      }

      // Redirige a la página deseada
      if (result?.ok) {
        router.push(`/admin/precios/${result.merma!.id}`);
      }
    }
  };

  return (
    <div className="lg:w-1/2 mt-8 bg-gray-200 rounded-lg p-4">
      <h2 className="text-2xl mb-4">Ingredientes:</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Cantidad con Merma</th>
            <th className="py-2 px-4 border-b">Precio con Merma</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingredientesByProduct.map((ingrediente) => (
            <tr key={ingrediente.id}>
              <td className="py-2 px-4 border-b">{ingrediente.name}</td>
              <td className="py-2 px-4 border-b">{(ingrediente.cantidadConMerma).toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{(ingrediente.precioConMerma).toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                <DeleteIngrediente id={ingrediente.id} onDelete={fetchIngredientesByProductId} productId={slug} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={handleUpdateMerma}
        className="bg-gray-600 text-white p-2 mt-4 text-xl font-bold rounded w-full"
        style={{ boxShadow: 'none', transition: 'none' }}
      >
        Enviar a Ingrediente
      </button>
    </div>
  );
}


