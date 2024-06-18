'use client';

import { useEffect, useState } from "react";
import { deleteMermaById, getMermas } from "@/actions";
import Link from "next/link";
import { IoArchiveOutline, IoTrashOutline } from "react-icons/io5";
import { Title } from "@/components/ui/title/Title";

interface Merma {
  id: string;
  name: string;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  porcentaje: number;
  precioAnterior: number;
  precioActual: number;
}

export default function MermaTable() {
  const [mermas, setMermas] = useState<Merma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMermas = async () => {
      try {
        const { ok, mermas, message } = await getMermas();
        if (ok && mermas) {
          // Ordenar las mermas por nombre en orden ascendente
          const sortedMermas = mermas.sort((a: Merma, b: Merma) => a.name.localeCompare(b.name));
          setMermas(sortedMermas);
        } else {
          setError(message || "Error fetching mermas");
        }
      } catch (error) {
        console.error("Error fetching mermas:", error);
        setError("Error fetching mermas");
      } finally {
        setLoading(false);
      }
    };

    fetchMermas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteMermaById({ id });
      setMermas(mermas.filter(merma => merma.id !== id));
    } catch (error) {
      console.error("Error deleting merma:", error);
      setError("Error deleting merma");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Title title="Listado de Precios Y Mermas" />
      <div className="flex justify-end mb-5">
        <Link href="/admin/precios/new" className="btn-primary">
          Nuevo Ingrediente
        </Link>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {/* <th className="px-4 py-2 border-b text-left">ID</th> */}
            <th className="px-4 py-2 border-b text-left">Nombre</th>
            <th className="px-4 py-2 border-b text-left">Unidad de Medida</th>
            <th className="px-4 py-2 border-b text-left">Porcentaje</th>
            <th className="px-4 py-2 border-b text-left">Precio Anterior</th>
            <th className="px-4 py-2 border-b text-left">Precio Actual</th>
            <th className="px-4 py-2 border-b text-left">Editar</th>
            <th className="px-4 py-2 border-b text-left">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {mermas.map((merma) => (
            <tr key={merma.id}>
              {/* <td className="px-4 py-2 border-b">{merma.id}</td> */}
              <td className="px-4 py-2 border-b">{merma.name}</td>
              <td className="px-4 py-2 border-b">{merma.unidadMedida}</td>
              <td className="px-4 py-2 border-b">{merma.porcentaje}</td>
              <td className="px-4 py-2 border-b">${merma.precioAnterior}</td>
              <td className="px-4 py-2 border-b">${merma.precioActual}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link href={`/admin/precios/${merma.id}`}>
                  <IoArchiveOutline size={30} />
                  <span className="ml-3 text-xl" style={{ color: "red" }}></span>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <button
                  onClick={() => handleDelete(merma.id)}
                  className="flex p-2 hover:bg-gray-100 rounded transition-all"
                >
                  <IoTrashOutline size={30} className="text-red-500" />
                  <span className="text-l text-red-500">Remover</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

