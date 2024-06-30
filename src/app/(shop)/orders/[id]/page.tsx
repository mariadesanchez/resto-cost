import { redirect } from "next/navigation";
import Image from "next/image";
import { titleFont } from '@/config/fonts';
import { getOrderById } from "@/actions/order/get-order-by-id";
import { currencyFormat } from "@/utils";
import { Title } from "@/components";
import { CaptureAndPrintButton } from "@/components/CaptureAndPrintButton";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect("/");
  }

  const address = order!.OrderAddress;

  // Calcular el total usando reduce
  const total = order!.OrderItem.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            {/* Items */}
            {order!.OrderItem.map((item) => (
              <div
                key={item.product.slug + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={item.product.images[0].url}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  alt={item.product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{item.product.title}</p>
                  <p>
                    ${(item.price).toFixed(2)} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 w-[500px]" id="Screen-Order">
            <div className="mb-10">
              <h2 className={`${titleFont.className} antialiased text-3xl text-center font-semibold my-1`}>Cocina | Blanch</h2>
              <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Cocina de Autor</h3>
            </div>
            <div className="w-full h-px bg-gray-600"></div>
            {/* Divider */}
            <div className="flex flex-col mt-5">
              {/* Items */}
              {order!.OrderItem.map((item) => (
                <div
                  key={item.product.slug + "-" + item.size}
                  className="grid grid-cols-2 gap-4 mb-5"
                >
                  <span className="text-left">{item.product.title}</span>
                  <span className="text-right">
                    {currencyFormat(item.price)} x {item.quantity}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <span className="text-left font-bold">Total:</span>
                <span className="text-right font-bold">{currencyFormat(total)}</span>
              </div>
              <div className="w-full h-px bg-gray-600 my-1"></div>
              <h3 className={`${titleFont.className} antialiased text-xl text-center font-semibold my-2`}>Gracias Por Visitarnos</h3>
              <div className="mt-5 mb-2 w-full flex justify-center">
                <CaptureAndPrintButton screenId="Screen-Order" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

