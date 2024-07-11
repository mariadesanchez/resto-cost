// components/ElaboracionesPage.tsx
'use client'
import { useEffect, useState } from 'react';
import { ProductGridItem } from '@/components';
import { getProductsByCategory } from '@/actions';
import { Product } from '@/interfaces';
import { titleFont } from '@/config/fonts';

export const ElaboracionesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProductsByCategory('Elaboraciones');
      setProducts(result);
    };

    fetchProducts();
  }, []);

  return (
    <div className={`${titleFont.className} rounded-md overflow-hidden fade-in container mx-auto`}>


      <h1 className="text-3xl font-bold my-6">Elaboraciones</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};


