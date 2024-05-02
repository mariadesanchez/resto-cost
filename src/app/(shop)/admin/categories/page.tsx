
export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table

import { getPaginatedCategories } from "@/actions/category/get-paginated-categories";
import { Pagination, Title } from "@/components";
import DeleteCategory from "@/components/category/DeleteCategory";



// import Image from "next/image";

import Link from "next/link";
import { IoPencilOutline } from "react-icons/io5";



interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function CategoriesPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { categories,totalPages } =
    await getPaginatedCategories({ page });

  return (
    <>
      <Title title="Agregar o Editar Categoría" />

      <div className="flex justify-end mb-5">
        <Link href="/admin/category/new" className="btn-primary">
          Nueva Categoría
        </Link>
      </div>

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
            
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
               Nombre
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Editar
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category:any) => (
              <tr
                key={category.id}
                className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
              >
               {category.id!=='f4e6c0f9-9c1f-47c0-af70-19c4a5102a8c'&&
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                 
                    {category.name}
                 
                </td>}
                {category.id!=='f4e6c0f9-9c1f-47c0-af70-19c4a5102a8c'&&
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {/* Editar */}
                 
                  <Link
                    href={`/admin/category/${category.id}`}
                    className="hover:underline"
                  >
                      <IoPencilOutline size={40} className="text-blue-500" />
                 
                    </Link>
                  </td>}
                  {category.id!=='f4e6c0f9-9c1f-47c0-af70-19c4a5102a8c'&&
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                
               
                  <DeleteCategory id={category.id}/>
                  </td>}
                
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
