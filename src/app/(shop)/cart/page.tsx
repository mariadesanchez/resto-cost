"use client"; // Añadir esta línea al inicio del archivo

import React from 'react';
import Link from 'next/link';
import { IoPencilOutline } from "react-icons/io5";
import { titleFont } from '@/config/fonts';
import { Title } from '@/components';
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
import { useCartStore } from "@/store";



export default function CartPage() {

  const clearCart = useCartStore( state => state.clearCart );

  // const captureAndPrint = async () => {
  //   const screenElement = document.getElementById('Screen');
  //   if (screenElement) {
  //     // Oculta el botón antes de capturar
  //     const printButton = document.getElementById('printButton');
  //     if (printButton) printButton.style.display = 'none';

  //     const canvas = await html2canvas(screenElement, {
  //       scale: 2, // Aumenta la escala para mejor calidad de imagen
  //       useCORS: true, // Permite el uso de recursos CORS
  //     });

  //     // Restaura la visibilidad del botón después de capturar
  //     if (printButton) printButton.style.display = 'block';

  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'pt',
  //       format: 'a4',
  //     });
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     clearCart();
  //     // router.push('/');
  //     // Abrir el PDF en una nueva ventana
  //     pdf.output('dataurlnewwindow');
      
  //   } else {
  //     console.error('Elemento con id "Screen" no encontrado');
  //   }
  // };

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
            {/* Items */}
            <ProductsInCart />
          </div>
          {/* Checkout - Resumen de orden */}
          <div id="Screen" className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-7 h-fit mx-auto">
            <h2 className={`${titleFont.className} antialiased text-3xl text-center font-semibold my-1`}>Cocina | Blanch</h2>
            <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Cocina de Autor</h3>
            <div className="w-full h-px bg-gray-600 my-2">

            </div>
            <OrderSummary />
            <div className="w-full h-px bg-gray-600 my-2"></div>
            <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Gracias Por Visitarnos</h3>
            {/* <div className="mt-5 mb-2 w-full flex justify-center">
              <button id="printButton" onClick={captureAndPrint} className="bg-gray-600 text-lg font-bold w-full text-white p-2 rounded px-6">Imprimir</button>
            </div> */}
             <div className="mt-5 mb-2 w-full">
              {/* To Do Checkout para cuando avancemos 
              en la App de Pedidos, tendria que mostrar el Link 
              checkout unicamente si no es admin */}
            {/* <Link 
            className="flex btn-primary justify-center"
            href="/checkout">
            Checkout
           </Link> */}
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}



