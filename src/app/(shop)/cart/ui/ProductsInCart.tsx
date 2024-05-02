
'use client'
import { useEffect, useState } from 'react';

import Image from 'next/image';

import { useCartStore } from '@/store';
import { ProductImage, QuantitySelector } from '@/components';
import Link from 'next/link';
import {
  IoTrashOutline,
  
} from "react-icons/io5";


export const ProductsInCart = () => {

  const updateProductQuantity = useCartStore( state => state.updateProductQuantity );
  const removeProduct = useCartStore( state => state.removeProduct );

  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore( state => state.cart );


  useEffect(() => {
    setLoaded(true) ;
  }, []);




  if( !loaded ) {
    return <p>Loading...</p>
  }

  return (

      <>
        {productsInCart.map((product) => (
          <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <div>
              <Image
                src={product.image}
                width={200}
                height={200}
                style={{
                  width: "300px",
                  height: "300px",
                }}
                alt={product.title}
                className="rounded"
              />
  
              <div>
                <Link
                  className="hover:underline cursor-pointer"
                  href={`/product/${product.slug}`}
                >
                  {product.size} - {product.title}
                </Link>
  
                <p>${product.price}</p>
                <QuantitySelector
                  quantity={product.quantity}
                  onQuantityChanged={(quantity) =>
                    updateProductQuantity(product, quantity)
                  }
                />
  
                {/* Move the remove button here */}
                <div className="flex flex-col mt-2">
                  <button
                    onClick={() => removeProduct(product)}
                    className="flex p-2 hover:bg-gray-100 rounded transition-all"
                  >
                    <IoTrashOutline size={30} className="text-red-500" />
                    <span className="text-l text-red-500">Remover</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };