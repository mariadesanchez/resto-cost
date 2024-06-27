'use client';
import { deleteIngredienteById } from '@/actions';
import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

interface DeleteIngredienteProps {
  id: string;
  onDelete: () => void;
  productId: string;
}

export const DeleteIngrediente: React.FC<DeleteIngredienteProps> = ({ id, onDelete, productId }) => {
  const handleDelete = async () => {
    try {
      await deleteIngredienteById({ id, productId });
      onDelete(); // Llama al callback onDelete después de eliminar el ingrediente
      // alert('Ingrediente eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar el ingrediente:', error);
      alert('No se pudo eliminar el ingrediente');
    }
  };

  return (
    <div className="flex flex-col mt-2">
      <button
        onClick={handleDelete}
        className="flex p-2 hover:bg-gray-100 rounded transition-all"
      >
        <IoTrashOutline size={30} className="text-red-500" />
        <span className="text-l text-red-500">Remover</span>
      </button>
    </div>
  );
};
