'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';


export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div
          key={`${product.slug}-${product.size}`}
          className="flex flex-col md:flex-row mb-5" // Utilizando flex-col para dispositivos pequeños y flex-row para dispositivos medianos y grandes
        >
          <div className="md:mr-5"> {/* Esto garantiza que haya margen derecho solo en dispositivos medianos y grandes */}
          <Image
              src={product.image}
              layout="responsive"
              width={200}
              height={200}
              className="rounded"
              alt={product.title}
              style={{
                maxWidth: 'calc(100% - 20px)', // Se ajusta el ancho de la imagen restando los márgenes
                maxHeight: '200px', // Altura máxima opcional para mantener la relación de aspecto
                objectFit: 'cover' // Opción para ajustar la imagen manteniendo la relación de aspecto
              }}
            />

          </div>
          <div>
            <span>
              {product.size} - {product.title} ({product.quantity})
            </span>

            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
