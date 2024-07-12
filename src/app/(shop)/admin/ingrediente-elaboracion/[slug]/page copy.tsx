'use client';
import React, { useEffect, useState, useCallback } from "react";
import { Ingrediente } from "@/interfaces";
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { DeleteIngrediente } from "@/components";
import { createUpdateIngrediente, getMermaByName,getIngredientsByProductId, getMermas, getProductById, updateProductPrice, createUpdateMermaIngrediente } from "@/actions";
import { useForm } from "react-hook-form";

import { useRouter } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  },
  ingrediente: Ingrediente;
}

interface FormInputs {
  name?: string;
  slug?: string;
  cantidadReceta?: number;
  unidadMedida?: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma?: number;
  precioConMerma?: number;
}

export default function IngredienteForm({ ingrediente, params }: Props) {
  const { slug } = params;
  const [productId, setProductId] = useState(slug);

  const [selectedPorcentaje, setSelectedPorcentaje] = useState<number | null>(null);
  const [selectedPrecio, setSelectedPrecio] = useState<number | null>(null);
  const [selectedUnidadMedida, setSelectedUnidadMedida] = useState('');
  const [cantidadReceta, setCantidadReceta] = useState<number | null>(null);
  const [mermas, setMermas] = useState<{ id: string; name: string; unidadMedida: UnidadMedida; porcentaje: number; precio: number; precioUnitarioActual: number }[]>([]);

  const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; }[]>([]);
  const [cantidadConMerma, setCantidadConMerma] = useState<number | null>(null);
  const [precioConMerma, setPrecioConMerma] = useState<number | null>(null);
 const [mermaId, setMermaId] = useState('')
  const [productName, setProductName] = useState('');
  const [costoTotal, setCostoTotal] = useState<number>(0);

  useEffect(() => {
    const fetchMermas = async () => {
      try {
        const mermasData = await getMermas();
        if (mermasData.ok) {
          const filteredMermas = (mermasData.mermas || []).map((merma) => ({
            id: merma.id,
            name: merma.name,
            unidadMedida: merma.unidadMedida,
            porcentaje: merma.porcentaje,
            precio: merma.precioActual,
            precioUnitarioActual: merma.precioUnitarioActual,
          }));
          const sortedMermas = filteredMermas.sort((a, b) => a.name.localeCompare(b.name));
          setMermas(sortedMermas);
        } else {
          console.error('Error al obtener las mermas:', mermasData.message);
          setMermas([]);
        }
      } catch (error) {
        console.error('Error al obtener las mermas:', error);
        setMermas([]);
      }
    };

    fetchMermas();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById(slug);
        setProductName(product?.title || '');
      } catch (error) {
        console.error('Error al obtener el Producto:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  const fetchIngredientesByProductId = useCallback(async () => {
    try {
      const ingredientesByProductId = await getIngredientsByProductId(slug);
      setIngredientesByProduct(ingredientesByProductId);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  }, [slug]);

  useEffect(() => {
    fetchIngredientesByProductId();
  }, [fetchIngredientesByProductId]);

  useEffect(() => {
    const totalPrice = async () => {
      try {
        const total = ingredientesByProduct.reduce((acc, ingrediente) => acc + ingrediente.precioConMerma, 0);
        setCostoTotal(total);
        await updateProductPrice(slug, total);
      } catch (error) {
        console.error('Error al obtener el Precio total:', error);
      }
    };

    totalPrice();
  }, [ingredientesByProduct, slug]);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    reset
  } = useForm<FormInputs>({
    defaultValues: {
      ...ingrediente,
    },
  });

  useEffect(() => {
    if (ingrediente) {
      setValue('unidadMedida', ingrediente.unidadMedida);
    }
  }, [ingrediente, setValue]);

  const onSubmit = async (data: FormInputs) => {
    const precioConMerma = (cantidadConMerma ?? 0) * (selectedPrecio ?? 0);
    data.precioConMerma = precioConMerma;

    const formData = new FormData();

    if (ingrediente && ingrediente.id) {
      formData.append("id", ingrediente.id);
    }

    formData.append("name", data.name ?? "");
    formData.append("slug", data.slug ?? "");
    formData.append("cantidadReceta", data.cantidadReceta?.toString() ?? "0");
    formData.append("unidadMedida", data.unidadMedida ?? "");
    formData.append("cantidadConMerma", (cantidadConMerma?.toString() ?? "0"));
    formData.append("precioConMerma", (precioConMerma?.toString() ?? "0"));

    const { ok, ingrediente: updatedIngrediente } = await createUpdateIngrediente(formData, productId);

    if (!ok) {
      alert('Producto no se pudo actualizar');
      return;
    }

    await fetchIngredientesByProductId();

    if (updatedIngrediente) {
      setIngredientesByProduct((prevIngredientes) => [
        ...prevIngredientes.filter(i => i.id !== updatedIngrediente.id),
        updatedIngrediente,
      ]);
    }

    // Limpiar todos los campos del formulario
    reset({
      name: '',
      slug: '',
      cantidadReceta: undefined,
      unidadMedida: 'unidad',
      cantidadConMerma: undefined,
      precioConMerma: undefined,
    });

    // Restablecer los estados relacionados
    setSelectedPorcentaje(null);
    setSelectedPrecio(null);
    setSelectedUnidadMedida('');
    setCantidadReceta(null);
    setCantidadConMerma(null);
    setPrecioConMerma(null);
     
  };

  const name = watch('name');

  useEffect(() => {
    if (name) {
      const slug = name
        .normalize("NFD") // Normaliza caracteres a su forma Unicode base
        .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w\-]+/g, ""); // Elimina caracteres especiales excepto guiones y guiones bajos

      setValue("slug", slug);
    }
  }, [name, setValue]);

  const handleMermaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMerma = mermas.find(merma => merma.name === event.target.value);
    if (selectedMerma) {
      setValue('name', selectedMerma.name); // Actualiza el valor del campo 'name'
      setSelectedPorcentaje(selectedMerma.porcentaje);
      setSelectedUnidadMedida(selectedMerma.unidadMedida);
      setSelectedPrecio(selectedMerma.precioUnitarioActual);
      setValue('unidadMedida', selectedMerma.unidadMedida);
      setCantidadReceta(null); // Limpiar cantidadReceta
      setCantidadConMerma(null); // Limpiar cantidadConMerma
      setPrecioConMerma(null); // Limpiar precioConMerma
      reset({
        name: selectedMerma.name,
        slug: '',
        cantidadReceta: undefined,
        unidadMedida: selectedMerma.unidadMedida,
      }); // Resetear el formulario excepto algunos campos
    } else {
      setValue('name', ''); // Limpia el valor si no hay merma seleccionada
      setValue('slug', ''); // Limpia el valor del slug
      setValue('unidadMedida', 'unidad'); // Restablece unidadMedida a 'unidad'
      setCantidadReceta(null); // Limpiar cantidadReceta
      setCantidadConMerma(null); // Limpiar cantidadConMerma
      setPrecioConMerma(null); // Limpiar precioConMerma
      reset({
        name: '',
        slug: '',
        cantidadReceta: undefined,
        unidadMedida: 'unidad',
      }); // Resetear el formulario completamente
    }
  };

  const handleCantidadRecetaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setCantidadReceta(isNaN(value) ? null : value);
    if (selectedPorcentaje !== null && value !== null) {
      setCantidadConMerma(value * (1 + (selectedPorcentaje / 100)));
    }
  };

  const handlePrecioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setSelectedPrecio(isNaN(value) ? null : value);
  };

  useEffect(() => {
    if (cantidadConMerma !== null && selectedPrecio !== null) {
      setPrecioConMerma(cantidadConMerma * selectedPrecio);
    }
  }, [cantidadConMerma, selectedPrecio]);

  useEffect(() => {
    setCantidadReceta(null);
  }, [selectedUnidadMedida]);

  const router = useRouter();


  const handleUpdateMerma = async () => {
    if (productName) {
      const fetchedMermaId = await getMermaByName(productName);
      let result;

      if (fetchedMermaId) {
        setMermaId(fetchedMermaId);
        // Actualiza la merma existente
        result = await createUpdateMermaIngrediente(costoTotal, productName, fetchedMermaId);
        if (result.ok) {
          console.log('MermaIngrediente actualizado correctamente:', result.merma);
        } else {
          console.error('Error al actualizar MermaIngrediente:', result.message);
        }
      } else {
        console.log('Merma no encontrada para el producto:', productName);
        // Crea un nuevo registro si no se encuentra
        result = await createUpdateMermaIngrediente(costoTotal, productName);
        if (result.ok) {
          console.log('MermaIngrediente creado correctamente:', result.merma);
        } else {
          console.error('Error al crear MermaIngrediente:', result.message);
        }
      }

      // Redirige a la página deseada
      if (result?.ok) {
        router.push(`/admin/precios/${result.merma!.id}`);
      }
    }
  };
  


  return (
    <div className="flex flex-col lg:flex-row p-8 space-y-8 lg:space-y-0">
      <div className="lg:w-1/2 flex flex-col bg-gray-200 rounded-lg p-4 m-2">
        <h1 className="text-2xl mb-4 text-center">{productName}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="mb-2">
            <label className="block mb-1 text-md font-medium text-gray-900">
              Selecciona Merma:
            </label>
            <select
              onChange={handleMermaChange}
              className="input w-full"
            >
              <option value="">Seleccionar</option>
              {mermas.map((merma) => (
                <option key={merma.id} value={merma.name}>
                  {merma.name}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden">
            <label className="block mb-1 text-md font-medium text-gray-900">
              Nombre Ingrediente
            </label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="input w-full"
            />
          </div>

          <div className="hidden">
            <label className="block mb-1 text-sm font-medium text-gray-900">
              Slug
            </label>
            <input
              type="text"
              {...register('slug', { required: true })}
              className="input w-full"
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="block mb-1 text-md font-medium text-gray-900">
              Cantidad Receta:
            </label>
            <input
              type="number"
              {...register('cantidadReceta', { required: true })}
              onChange={handleCantidadRecetaChange}
              className="input w-full"
            />
          </div>

          <div className="m-1 p-3 bg-gray-400 rounded-xl opacity-100">
            <div className="flex flex-col mb-2">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Unidad de Medida
              </label>
              <select
                {...register('unidadMedida')}
                className="input w-full"
                disabled
              >
                <option value="miligramos">Miligramos</option>
                <option value="gramos">Gramos</option>
                <option value="kilo">Kilo</option>
                <option value="mililitros">Mililitros</option>
                <option value="litro">Litro</option>
                <option value="unidad">Unidad</option>
              </select>
            </div>

            <div className="flex flex-col mb-2">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Cantidad con Merma
              </label>
              <input
                type="number"
                value={cantidadConMerma ?? ''}
                readOnly
                className="input w-full bg-gray-100"
                disabled
              />
            </div>

            <div className="flex flex-col mb-2">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Precio con Merma
              </label>
              <input
                type="number"
                value={precioConMerma ?? ''}
                readOnly
                className="input w-full bg-gray-100"
              />
            </div>
            <div className="hidden">
              <label className="block mb-1 text-sm font-medium text-gray-900">
                Precio Unitario
              </label>
              <input
                type="number"
                value={selectedPrecio ?? ''}
                onChange={handlePrecioChange}
                className="input w-full"
                disabled
              />
            </div>
          </div>
          <div className="mb-2">
           

          <div className="flex justify-end mb-5 text-2xl font-bold">
  <button
    type="submit"
    className="bg-gray-600 text-white p-2 rounded w-full"
    style={{ boxShadow: 'none', transition: 'none' }}
  >
    Guardar Ingrediente
  </button>
</div>

            
          </div>
          <div className="w-full">
          {selectedPorcentaje !== null && (
            <div className="flex flex-col mb-2">
              <span>Porcentaje De merma: {selectedPorcentaje}%</span>
            </div>
          )}
          {selectedPrecio !== null && (
            <div className="flex flex-col mb-2">
              <span>Precio De Mercado: ${(selectedPrecio).toFixed(2)}</span>
            </div>
          )}
       
            <h3 className="text-xl text-center font-bold text-red-500">Costo Total: ${(costoTotal).toFixed(2)}</h3>

          </div>
        </form>
      </div>

      <div className="lg:w-1/2 mt-8 bg-gray-200 rounded-lg p-4">
        <h2 className="text-2xl mb-4">Ingredientes:</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              {/* <th className="py-2 px-4 border-b">Cantidad Receta</th> */}
              {/* <th className="py-2 px-4 border-b">Unidad Medida</th> */}
              <th className="py-2 px-4 border-b">Cantidad con Merma</th>
              <th className="py-2 px-4 border-b">Precio con Merma</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientesByProduct.map((ingrediente) => (
              <tr key={ingrediente.id}>
                <td className="py-2 px-4 border-b">{ingrediente.name}</td>
                {/* <td className="py-2 px-4 border-b">{ingrediente.cantidadReceta}</td> */}
                {/* <td className="py-2 px-4 border-b">{ingrediente.unidadMedida}</td> */}
                <td className="py-2 px-4 border-b">{(ingrediente.cantidadConMerma).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">{(ingrediente.precioConMerma).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                <DeleteIngrediente id={ingrediente.id} onDelete={fetchIngredientesByProductId} productId={productId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
    type="button" // Cambia a "button" para evitar el comportamiento de envío de formularios
    onClick={handleUpdateMerma}
    className="bg-gray-600 text-white p-2 mt-4 text-xl font-bold rounded w-full"
    style={{ boxShadow: 'none', transition: 'none' }}
  >
    Enviar a Ingrediente
  </button>
      </div>
    </div>
  );
}







