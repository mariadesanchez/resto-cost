'use client';


import Image from 'next/image';
import Link from 'next/link';
import { ProductImage } from '../../product/product-image/ProductImage';
import { Product } from '@/interfaces';
import { useState } from 'react';
import { useSession } from "next-auth/react";

interface Props {
  product: Product;
}


export const ProductGridItem = ( { product }: Props ) => {

  const [ displayImage, setDisplayImage ] = useState( product.images[ 0 ] );

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div className="rounded-md overflow-hidden fade-in">
 
      <Link href={ `/product/${ product.slug }` }>
         <Image
          src={ displayImage }
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
          className="hover:text-blue-600"
          href={ `/product/${ product.slug }` }>
          { product.title }
        </Link>
        { (product.inStock ==0 && isAdmin)&&
        <div className='flex'>
       
        <Link className="font-bold text-red-500 text-2xl" href={'admin/products'}>Sin Stock</Link>
        
        
        </div>
       }
         { (product.inStock ==0 && !isAdmin)&&
        <div className='flex'>
       
        <span className="font-bold text-red-500 text-2xl">Sin Stock</span>
        
        
        </div>
       }
        
        
        
        
       {product.inStock >0 &&  
         <div className='flex'>
         <span className="font-bold mr-5">${ product.price }</span>
        
         </div>
        }
       
      </div>

    </div>
  );
};