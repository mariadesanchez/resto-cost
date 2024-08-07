"use client";
import { useForm, Controller } from "react-hook-form";
import {  Merma } from "@/interfaces";
import { createUpdateMerma } from "@/actions";
import { useRouter } from 'next/navigation';
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { useEffect } from "react";

interface Props {
  merma: Merma;
}

interface FormInputs {
  name: string;
  unidadMedida: UnidadMedida;
  porcentaje: number;
  precioActual: number;
  cantidad: number;
  precioUnitarioActual: number;
}

export const MermaForm = ({ merma }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
    control,
  } = useForm<FormInputs>({
    defaultValues: {
      ...merma,
    },
  });

  const precioActual = watch("precioActual");
  const cantidad = watch("cantidad");

  useEffect(() => {
    const precioUnitarioActual = precioActual && cantidad ? precioActual / cantidad : 0;
    setValue("precioUnitarioActual", precioUnitarioActual, { shouldValidate: true });
  }, [precioActual, cantidad, setValue]);

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { ...mermaToSave } = data;
    if (merma.id) {
      formData.append("id", merma.id ?? "");
    }

    formData.append("name", mermaToSave.name);
    formData.append("unidadMedida", mermaToSave.unidadMedida);
    formData.append("porcentaje", mermaToSave.porcentaje.toString());
    formData.append("precioActual", mermaToSave.precioActual.toString());
    formData.append("cantidad", mermaToSave.cantidad.toString());
    formData.append("precioUnitarioActual", mermaToSave.precioUnitarioActual.toString());

    const { ok } = await createUpdateMerma(formData);

    if (!ok) {
      alert('Ingrediente no se pudo actualizar');
      return;
    }

    router.push('/admin/listPrice');
  };

  return (
    <div className="bg-gray-200 p-10 rounded-lg shadow-lg max-w-xl mx-auto">
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-3"
    >
      <div className="w-full">
        <div className="flex flex-col mb-2 font-bold w-full">
          <span>Ingrediente</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-300 w-full"
            {...register("name", { required: true })}
          />
        </div>
  
        <div className="flex flex-col mb-2 w-full">
          <label className="block mb-1 text-sm font-medium text-gray-900">
            Unidad de Medida
          </label>
          <select
            {...register('unidadMedida')}
            className="input w-full"
          >
            <option value="miligramos">Miligramos</option>
            <option value="gramos">Gramos</option>
            <option value="kilo">Kilo</option>
            <option value="mililitros">Mililitros</option>
            <option value="litro">Litro</option>
            <option value="unidad">Unidad</option>
          </select>
        </div>
  
        <div className="flex flex-col mb-2 font-bold w-full">
          <span>Porcentaje</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-300 font-bold w-full"
            {...register("porcentaje", { required: true, min: 0 })}
          />
        </div>
  
        <div className="flex flex-col mb-2 font-bold w-full">
          <span>Precio Actual</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-300 font-bold w-full"
            {...register("precioActual", { required: true, min: 0 })}
          />
        </div>
  
        <div className="flex flex-col mb-2 font-bold w-full">
          <span>Cantidad</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-300 font-bold w-full"
            {...register("cantidad", { required: true, min: 0 })}
          />
        </div>
  
        <div className="flex flex-col mb-2 font-bold w-full">
          <span>Precio Unitario Actual</span>
          <Controller
            name="precioUnitarioActual"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                className="p-2 border rounded-md bg-gray-300 font-bold w-full"
                {...field}
                readOnly
              />
            )}
          />
        </div>
  
        <button className=" bg-gray-500 rounded-md text-2xl text-white font-bold w-full m-2 p-2">Guardar</button>
      
      </div>
    </form>
  </div>
 
  );
};


