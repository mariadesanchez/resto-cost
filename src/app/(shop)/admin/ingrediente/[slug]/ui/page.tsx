'use client';

export {createUpdateIngrediente} from '@/actions';
export {getIngredienteBySlug} from '@/actions'
export {getIngredientsByProductId} from '@/actions'
export {deleteIngredienteById} from '@/actions'
export {getPricesWithMermaByProductId} from '@/actions'
// src/pages/admin/ingrediente/page.tsx
import {IngredienteForm}   from './IngredienteForm';


// page.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Title } from '@/components';
// import IngredienteForm from './ui/IngredienteForm';
import { Ingrediente } from '@/interfaces';
import { getProductById, getIngredientsByProductId, updateProductPrice } from '@/actions';

interface Props {
  params: {
    slug: string;
  };
}

const IngredientePage: React.FC<Props> = ({ params }) => {
  const { slug } = params;
  const [ingrediente, setIngrediente] = useState<Ingrediente | null>(null);
  const [ingredientesByProduct, setIngredientesByProduct] = useState<Ingrediente[]>([]);
  const [productName, setProductName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(slug);
        setProductName(product?.title || '');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const fetchIngredientesByProductId = async () => {
      try {
        const ingredientes = await getIngredientsByProductId(slug);
        setIngredientesByProduct(ingredientes);
      } catch (error) {
        console.error('Error fetching ingredientes:', error);
      }
    };

    fetchIngredientesByProductId();
  }, [slug]);

  const handleIngredienteFormSubmit = async () => {
    try {
      const totalCost = calculateTotalCost();
      await updateProductPrice(slug, totalCost);
      await getIngredientsByProductId(slug);
    } catch (error) {
      console.error('Error updating product price:', error);
    }
  };

  const calculateTotalCost = (): number => {
    return ingredientesByProduct.reduce((total, ingrediente) => {
      return total + ingrediente.precioConMerma;
    }, 0);
  };

  return (
    <>
      <Title title={productName ? `Editar plato ${productName}` : 'Nuevo plato'} />

      {ingrediente && (
        <IngredienteForm
          ingrediente={ingrediente}
          productId={slug}
        
        />
      )}

      {/* Mostrar los ingredientes relacionados con el producto */}
      <h2 className="text-lg font-bold mt-8">Ingredientes del producto {productName}</h2>
      <ul>
        {ingredientesByProduct.map(ingrediente => (
          <li key={ingrediente.id}>{ingrediente.name} - {ingrediente.cantidadReceta}</li>
        ))}
      </ul>
    </>
  );
};

export default IngredientePage;
