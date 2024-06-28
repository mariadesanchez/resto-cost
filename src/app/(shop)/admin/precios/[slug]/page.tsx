"use client";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { createUpdateMerma, getMermaById, updateIngredientesByMerma } from "@/actions"; // Asegúrate de importar correctamente
import { Merma } from "@/interfaces/merma.interface";

interface Props {
  params: {
    slug: string;
  },
  merma?: Merma;
}

interface FormInputs {
  id?: string;
  name: string;
  cantidad: number;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  porcentaje: number;
  precioAnterior: number;
  precioActual: number;
  precioUnitarioActual: number;
}

export default function MermaForm({ merma, params }: Props) {
  const { slug } = params;
  const router = useRouter();
  const [adjustmentFactor, setAdjustmentFactor] = useState(1)
  const [initialValues, setInitialValues] = useState<FormInputs>({
    id: merma?.id || '',
    name: '',
    cantidad: 0,
    unidadMedida: 'gramos',
    porcentaje: 0,
    precioAnterior: 0,
    precioActual: 0,
    precioUnitarioActual: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerma = async () => {
      try {
        const mermaData = await getMermaById(slug);
        if (mermaData.ok && mermaData.merma) {
          const { id, name, unidadMedida, porcentaje, precioAnterior, precioActual, cantidad, precioUnitarioActual } = mermaData.merma;
          setInitialValues({ id, name, unidadMedida, porcentaje, precioAnterior, precioActual, cantidad, precioUnitarioActual });
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

  const { handleSubmit, register, formState: { isValid }, setValue, watch } = useForm<FormInputs>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const precioActual = watch('precioActual');
  const cantidad = watch('cantidad');
  const precioUnitarioActual = watch('precioUnitarioActual');
  const precioAnterior = watch('precioAnterior');
  useEffect(() => {
    if (!loading) {
      setValue("id", initialValues.id);
      setValue("name", initialValues.name);
      setValue("cantidad", initialValues.cantidad);
      setValue("unidadMedida", initialValues.unidadMedida);
      setValue("porcentaje", initialValues.porcentaje);
      setValue("precioAnterior", initialValues.precioAnterior);
      setValue("precioActual", initialValues.precioActual);
      setValue("precioUnitarioActual", initialValues.precioUnitarioActual);
    
    }
  }, [loading, initialValues, setValue]);

  useEffect(() => {
    if (precioActual !== initialValues.precioActual) {
      setValue('precioAnterior', initialValues.precioActual);
    }
  }, [precioActual, initialValues.precioActual, setValue]);

  useEffect(() => {
    if (precioActual && cantidad) {
      const precioUnitarioActual = precioActual / cantidad;
      setValue('precioUnitarioActual', precioUnitarioActual);
    }
  }, [precioActual, cantidad, setValue]);

  useEffect(() => {
    if (precioActual && precioAnterior) {
     
      const adjustmentFactor = precioActual / precioAnterior;
      setAdjustmentFactor(adjustmentFactor);
   
    }
  
}, [precioActual, precioAnterior, setValue]);


  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();

    if (data.id) {
      formData.append("id", data.id);
    }

    formData.append("name", data.name);
    formData.append("unidadMedida", data.unidadMedida);
    formData.append("cantidad", data.cantidad.toString());
    formData.append("porcentaje", data.porcentaje.toString());
    formData.append("precioAnterior", data.precioAnterior.toString());
    formData.append("precioActual", data.precioActual.toString());
    formData.append("precioUnitarioActual", data.precioUnitarioActual.toString());

    const { ok, merma: updatedMerma } = await createUpdateMerma(formData);

    if (!ok) {
      alert('Merma no se pudo actualizar');
      return;
    }

    // Obtener el factor de ajuste calculado
    // const adjustmentFactor = data.precioActual / data.precioAnterior;

    // Actualizar el precioConMerma de los ingredientes
    const { ok: updateOk } = await updateIngredientesByMerma(data.name, adjustmentFactor);

    if (!updateOk) {
      alert('Precio Actualizado Correctamente!!!');
      router.push('/admin/precios/listPrice');
    }

    router.push('/admin/precios/listPrice'); // Redirige a la lista de mermas
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full bg-white p-5 shadow-lg rounded-lg">
      <div className="w-full mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Merma y Precios</h1>
        <div className="flex flex-col mb-2">
          <label htmlFor="cantidad" className="mb-1 font-bold">Cantidad</label>
          <input
            id="cantidad"
            type="text"
            className="p-2 border rounded-md font-bold bg-gray-200"
            {...register("cantidad", { required: true })}
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="precioActual" className="mb-1 font-bold">Precio Actual</label>
          <input
            id="precioActual"
            type="number"
            className="p-2 border rounded-md font-bold bg-gray-200"
            {...register("precioActual", { required: true, min: 0 })}
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="unidadMedida" className="mb-1 font-bold">Medida</label>
          <select
            id="unidadMedida"
            className="p-2 border mb-4 rounded-md bg-white font-bold"
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
          <label htmlFor="porcentaje" className="mb-1 font-bold">Porcentaje</label>
          <input
            id="porcentaje"
            type="number"
            className="p-2 border rounded-md bg-gray-200 font-bold"
            {...register("porcentaje", { required: true, min: 0 })}
          />
        </div>
        <div className="m-1 p-3 bg-orange-400 rounded-xl">
          <div className="flex flex-col mb-2">
            <label htmlFor="name" className="mb-1 font-bold">Nombre</label>
            <input
              id="name"
              type="text"
              className="p-2 border rounded-md bg-white font-bold"
              disabled
              {...register("name", { required: true })}
            />
          </div>
          <div className="flex flex-col mb-2">
            <label htmlFor="precioAnterior" className="mb-1 font-bold">Precio Anterior</label>
            <input
              id="precioAnterior"
              type="number"
              className="p-2 border rounded-md bg-white font-bold cursor-not-allowed" // Añadido cursor-not-allowed para indicar que está deshabilitado
              {...register("precioAnterior", { required: true, min: 0 })}
              disabled // Añadido atributo disabled
            />
          </div>
        </div>
        <div className="hidden">
          <label htmlFor="precioUnitarioActual" className="mb-1 font-bold">Precio Unitario Actual</label>
          <input
            id="precioUnitarioActual"
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("precioUnitarioActual", { required: true, min: 0 })}
            disabled
          />
        </div>
        <button type="submit" className="btn-primary w-full p-2 bg-blue-500 text-white mb-2 mt-2 text-2xl font-bold rounded-md" disabled={!isValid}>
          Guardar
        </button>
      </div>
    </form>
  );
}

