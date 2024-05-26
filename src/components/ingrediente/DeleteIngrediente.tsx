'use client';
import { deleteIngredienteById } from '@/actions';
import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';

export function DeleteIngrediente({ id, onDelete }: { id: string, onDelete: (id: string) => void }): React.JSX.Element {
  const handleDelete = async () => {
    try {
      await deleteIngredienteById({ id });
      onDelete(id);
      alert('Ingrediente eliminado correctamente');
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
}
