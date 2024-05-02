'use client'
import { deleteCategoryById } from '@/actions/category/delete-category-by-id'
import React from 'react'
import { IoTrashOutline } from 'react-icons/io5';

interface Props {
  id: string;
}

export const DeleteCategory = ({ id }: Props) => {
  return (
  //antes de eliminar la categoría tengo que colocarle el UUI
  //de la categoría Sin Categría,por ejemplo ed3945ce-fda4-4a9b-a028-32733212e28d,
  //update a categoryId con este UUI, asi me queda sin categoría
  //y no tengo que eliminarlo físicamente por si en algùn momento necesito dicho producto
    <div className="flex flex-col mt-2">
    <button
       onClick={() => deleteCategoryById(id)}
      className="flex p-2 hover:bg-gray-100 rounded transition-all"
    >
      <IoTrashOutline size={30} className="text-red-500" />
      <span className="text-l text-red-500">Remover</span>
    </button>
  </div>
  )
}

export default DeleteCategory