import Link from 'next/link';
import {IoStorefrontOutline} from "react-icons/io5";


import { Title } from '@/components';
import { ProductsInCart } from '../cart/ui/ProductsInCart';
import { OrderSummary } from '../cart/ui/OrderSummary';




export default function CartPage() {


  // redirect('/empty');



  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

      <div className="flex flex-col w-[1000px]">

        <Title title='Tus Compras...' />


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */ }
          <div className="flex flex-col mt-5">
        
            <Link
              href="/"
           
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
            <IoStorefrontOutline size={30} mb={3} className="text-green-600" />
              <span className="ml-3 mb-3 text-xl text-green-600"> Continúa comprando</span>
            </Link>


          {/* Items */ }
            <ProductsInCart/>
         
           </div>




          {/* Checkout - Resumen de orden */ }
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <OrderSummary />

            <div className="mt-5 mb-2 w-full">
              <Link 
                className="flex btn-primary justify-center"
                href="/checkout/address">
                Checkout
              </Link>
            </div>


          </div>



        </div>



      </div>


    </div>
  );
}