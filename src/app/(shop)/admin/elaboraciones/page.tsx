export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders, getPaginatedProductsWithImages } from "@/actions";
import { getPaginatedProductsWithImagesElaboration } from "@/actions/product/product-pagination-elaboration";
import { Pagination, ProductImage, Title } from "@/components";
import DeleteProduct from "@/components/product/delete-product";
import { currencyFormat } from "@/utils";
import Image from "next/image";

import Link from "next/link";
import { redirect } from "next/navigation";
import { IoCardOutline } from "react-icons/io5";

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImagesElaboration({ page });

  return (
    <>
      <Title title="Agregar o Editar Plato" />

      <div className="flex justify-end mb-5 text-2xl font-bold">
        <Link href="/admin/product/new"
         className="bg-gray-600 text-white p-2 rounded px-6">
          Nuevo Plato
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
        <thead className="bg-gray-400 border-b opacity-100">
            <tr>
              <th
                scope="col"
                className="text-2xl  text-white px-6 py-4 text-left"
              >
                Ir a Plato
              </th>
              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
                Editar Plato
              </th>
              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
                Precio ($)
              </th>
              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
                Ingredientes
              </th>
              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
                Stock
              </th>
              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
               Porción
              </th>

              <th
                scope="col"
                className="text-2xl text-white px-6 py-4 text-left"
              >
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <Link href={`/product/${product.slug}`}>
                  <Image
            src={product.images[0] }
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.title}
            className="mr-5 rounded"
          />
                  </Link>
                </td>
                <td className="text-xl  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/product/${product.slug}`}
                    className="hover:underline"
                  >
                    {product.title}
                  </Link>
                </td>

                <td className="text-xl font-bold  text-gray-900 px-6 py-4 whitespace-nowrap">
                  {currencyFormat(product.price)}
                </td>

                <td className="text-xl font-bold text-black-900 px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/admin/ingrediente-elaboracion/${product.id}`}
                    className="hover:underline"
                  >
                    Ingredientes
                  </Link>
                </td>

                <td className="text-xl text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {product.inStock}
                </td>

                <td className="text-xl text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                  {product.sizes.join(", ")}
                </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                  <DeleteProduct id={product.id}/>
                  </td>

              </tr>
            ))}
          </tbody>
        </table>
      

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
