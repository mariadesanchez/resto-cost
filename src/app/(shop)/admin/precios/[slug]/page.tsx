'use client';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { createUpdateMerma, getMermaById } from "@/actions";

import { Merma } from "@/interfaces/merma.interface";

interface Props {
  params: {
    slug: string;
  },
  merma?: Merma;
}

interface FormInputs {
  name: string;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  porcentaje: number;
  precio: number;
}

export default function MermaForm({ merma, params }: Props) {
  const { slug } = params;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<FormInputs>({
    name: '',
    unidadMedida: 'gramos',
    porcentaje: 0,
    precio: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerma = async () => {
      try {
        const mermaData = await getMermaById(slug);
        if (mermaData.ok && mermaData.merma) {
          const { name, unidadMedida, porcentaje, precio } = mermaData.merma;
          setInitialValues({ name, unidadMedida, porcentaje, precio });
        } else {
          console.error('Error al obtener la Merma:', mermaData.message);
        }
      } catch (error) {
        console.error('Error al obtener la Merma:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMerma();
    } else {
      setLoading(false);
    }
  }, [slug]);

  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
  } = useForm<FormInputs>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (!loading) {
      setValue("name", initialValues.name);
      setValue("unidadMedida", initialValues.unidadMedida);
      setValue("porcentaje", initialValues.porcentaje);
      setValue("precio", initialValues.precio);
    }
  }, [loading, initialValues, setValue]);

  const onSubmit = async (data: FormInputs) => {
    console.log("Form data before sending:", data);

    const formData = new FormData();

    if (merma && merma.id) {
      formData.append("id", merma.id);
    }

    formData.append("name", data.name);
    formData.append("unidadMedida", data.unidadMedida);
    formData.append("porcentaje", data.porcentaje.toString()); // Convertir a string
    formData.append("precio", data.precio.toString()); // Convertir a string

    const { ok, merma: updatedMerma } = await createUpdateMerma(formData);

    if (!ok) {
      alert('Merma no se pudo actualizar');
      return;
    }

    router.push('/admin/precios/listPrice');  // Redirige a la lista de mermas
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full bg-white p-5 shadow-lg rounded-lg">
      <div className="w-full mb-4">
        <h1 className="text-2xl font-bold mb-4">Formulario de Merma</h1>
        
        <div className="flex flex-col mb-2">
          <label htmlFor="name" className="mb-1">Nombre</label>
          <input
            id="name"
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("name", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="unidadMedida" className="mb-1">Unidad de Medida</label>
          <select
            id="unidadMedida"
            className="p-2 border rounded-md bg-gray-200"
            {...register("unidadMedida")}
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
          <label htmlFor="porcentaje" className="mb-1">Porcentaje</label>
          <input
            id="porcentaje"
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("porcentaje", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <label htmlFor="precio" className="mb-1">Precio</label>
          <input
            id="precio"
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("precio", { required: true, min: 0 })}
          />
        </div>

        <button type="submit" className="btn-primary w-full p-2 bg-blue-500 text-white rounded-md" disabled={!isValid}>
          Guardar
        </button>
      </div>
    </form>
  );
}