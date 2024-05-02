'use client'
import { mercadoPagoCheckPayment } from "@/actions/payments/mercado-pago-payment";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

interface Props {
  orderId: string;
  orderTotal: number;
}

export const MercadoPagoButton = ({ orderId, orderTotal }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMercadoPago = async () => {
    if (isLoading) return;
    setIsLoading(true);

    mercadoPagoCheckPayment({
      id: orderId,
      total: orderTotal,
    });
  };

  return (
    <>
      <div
        className={clsx({
          "flex w-full  h-14 justify-center items-center border-blue-500 border-4 rounded-lg hover:bg-blue-500 cursor-pointer overflow-hidden  shadow-xl":
            isLoading === false,
          "flex w-full  h-14 justify-center items-center bg-gray-400 border-gray-400 border-4 rounded-lg hover:bg-gray-400 cursor-pointer overflow-hidden  shadow-xl":
            isLoading === true,
        })}
        onClick={() => {
          handleMercadoPago();
        }}
      >
        <Image
          src="/imgs/mercadopago.jpg"
          alt="Logo"
          width={500}
          height={500}
          className="object-contain  h-40 "
        />
      </div>
    </>
  );
};



