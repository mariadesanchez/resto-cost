
"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { titleFont } from '@/config/fonts';
import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import { CaptureAndPrintButton } from "@/components/orders/CaptureAndPrintButton";

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [mesa, setMesa] = useState('1'); // Nuevo estado para la mesa
  const address = useAddressStore((state) => state.address);
  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    //! Server Action
    const resp = await placeOrder(productsToOrder, address, mesa);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    //* Todo salio bien!
    clearCart();
    router.replace('/');
  }

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="grid grid-cols-2 w-[600px]">
    <div id="Screen" className="col-span-2 mb-5">
      <label htmlFor="mesa" className="block text-xl font-medium text-gray-700 mb-2">Mesa:</label>
      <div className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-2xl ">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
          <label key={number} className="inline-flex items-center mr-2">
            <input
              type="radio"
              name="mesa"
              value={number}
              checked={mesa === number.toString()}
              onChange={(e) => setMesa(e.target.value)}
              className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            />
            <span className="ml-2">{number}</span>
          </label>
        ))}
      </div>
    </div>
    <div className="col-span-2 w-full max-w-6xl bg-white rounded-xl shadow-xl p-7 h-fit mx-auto">
      <h2 className={`${titleFont.className} antialiased text-3xl text-center font-semibold my-1`}>Cocina | Blanch</h2>
      <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Cocina de Autor</h3>
      <div className="w-full h-px bg-gray-600 my-2"></div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <span className="text-left">No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>
      </div>
      {cart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="grid grid-cols-2 gap-4 mb-5">
          <>
            <span className="text-left">{product.title}</span>
            <span className="text-right">${product.price.toFixed(2)} x {product.quantity}</span>
          </>
        </div>
      ))}
      <span></span>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <span className="text-left">Total:</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>
      </div>
      <div className="w-full h-px bg-gray-600 my-2"></div>
    
      <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Gracias Por Visitarnos</h3>
      <div className="mt-5 mb-2 w-full flex justify-center">
        <CaptureAndPrintButton
          screenId='Screen'
          onAfterPrint={onPlaceOrder}
        />
      </div>
    </div>
  </div>
  
  );
  
};
