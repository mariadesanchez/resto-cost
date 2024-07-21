import React, { useState } from 'react';
import { titleFont } from '@/config/fonts';
import { getOrdersByUserByDayByMesa } from "@/actions/order/get-orders-by-user-day-mesa";
import { currencyFormat } from "@/utils";
// import { MesaSelector } from "@/components";
import { Title } from "@/components";
import {PrintButton} from "@/components"; // Importar el componente de botón

interface Props {
  params: {
    mesa: string;
  };
}

export default async function OrdersByUserDayMesaPage({ params }: Props) {
  const { mesa } = params;
  const { ok, orders } = await getOrdersByUserByDayByMesa(mesa);

  if (!ok) {
    console.error("No se pudieron obtener las órdenes:", orders);
    // Puedes manejar la redirección de otra manera aquí si es necesario
  }
  

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center w-full max-w-6xl mt-10">
        <Title title={`Órdenes para la mesa #${mesa}`} />
        {/* <MesaSelector /> Asegúrate de que esto esté aquí y no antes del div contenedor */}

        <div className="bg-white rounded-xl shadow-xl p-7 w-full sm:w-[500px] mt-10" id="ScreenOrder">
          <div className="mb-10">
            <h2 className={`${titleFont.className} antialiased text-3xl text-center font-semibold my-1`}>Cocina | Blanch</h2>
            <h3 className={`${titleFont.className} antialiased text-2xl text-center font-semibold my-2`}>Cocina de Autor</h3>

          </div>
          <div className="w-full h-px bg-gray-600"></div>
          <div className="flex flex-col mt-5 justify-center items-center">
            {orders!.map((order) => (
              <div key={order.id} className="grid grid-cols-2 gap-4 mb-5">
            
                {order.OrderItem.map((item) => (
                  <React.Fragment key={item.id}>

                    <span className="text-left">{item.product.title}</span>
                    <span className="text-right">
                      {currencyFormat(item.price)} x {item.quantity}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <span className="text-left font-bold">Total:</span>
              <span className="text-right font-bold">
                {currencyFormat(
                  orders!.reduce((acc, order) =>
                    acc + order.OrderItem.reduce((acc, item) => acc + item.price * item.quantity, 0), 0)
                )}
              </span>
            </div>
            <div className="w-full h-px bg-gray-600 my-1"></div>
            <h3 className={`${titleFont.className} antialiased text-2xl text-center font-semibold my-2`}>Contáctanos...</h3>
            <div className="mt-5 mb-2 w-full">
              <PrintButton screenId={'ScreenOrder'} /> {/* Usar el componente de botón */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
