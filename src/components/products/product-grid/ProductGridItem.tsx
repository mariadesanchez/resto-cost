'use client';



import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { titleFont } from '@/config/fonts';
import { Product } from '@/interfaces';

interface Props {
  product: Product;
}

export const ProductGridItem = ( { product }: Props ) => {

  const [ displayImage, setDisplayImage ] = useState(product.images[0]);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div className={`${titleFont.className} rounded-md overflow-hidden fade-in`}>
      <Link href={ `/product/${ product.slug }` }>
         <Image
          src={ displayImage } // Asegúrate de que este valor sea una URL válida
          alt={ product.title }
          className="w-full object-cover rounded"
          width={ 500 }
          height={ 500 }
          onMouseEnter={ () => setDisplayImage( product.images[1] )  }
          onMouseLeave={ () => setDisplayImage( product.images[0] ) }
          />
      </Link>

      <div className="p-4 flex flex-col">
        <Link
          className="hover:text-blue-600 text-3xl"
          href={ `/product/${ product.slug }` }>
          { product.title }
        </Link>
        { (product.inStock === 0 && isAdmin) &&
          <div className='flex'>
            <Link className="font-bold text-red-500 text-2xl" href={'/admin/products'}>Sin Stock</Link>
          </div>
        }
        { (product.inStock === 0 && !isAdmin) &&
          <div className='flex'>
            <span className="font-bold text-red-500 text-2xl">Sin Stock</span>
          </div>
        }
        {product.inStock > 0 &&  
          <div className='flex'>
            <span className="font-bold mr-5 text-2xl">${product.price.toFixed(2)}</span>
          </div>
        }
      </div>
    </div>
  );
};
