"use client"; // Añadir esta línea al inicio del archivo

import React from 'react';
import Link from 'next/link';
import { IoPencilOutline, IoGridOutline } from "react-icons/io5";
import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { PlaceOrder } from './ui/PlaceOrder';

import { useCartStore } from "@/store";

export default function CartPage() {
 

  

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title='Tus Compras...' />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <Link href="/" className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
              <IoPencilOutline size={30} mb={3} className="text-green-600" />
              <span className="ml-3 mb-3 text-xl text-green-600">Agregar Producto</span>
            </Link>
            <Link href="/cart" className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
              <IoGridOutline size={30} mb={3} className="text-green-600" />
              <span className="ml-3 mb-3 text-xl text-green-600">Editar Mesa</span>
            </Link>
            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Checkout - Resumen de orden */}
        
            <PlaceOrder />
           
        </div>
      </div>
    </div>
  );
}
