"use client";
import { useForm, Controller } from "react-hook-form";
import { Ingrediente } from "@/interfaces";
import { createUpdateMerma } from "@/actions";
import { useRouter } from 'next/navigation';
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { useEffect } from "react";

interface Props {
  ingredient: Ingrediente;
}

interface FormInputs {
  name: string;
  unidadMedida: UnidadMedida;
  porcentaje: number;
  precioActual: number;
  cantidad: number;
  precioUnitarioActual: number;
}

export const IngredientForm = ({ ingredient }: Props) => {
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
      ...ingredient,
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
    const { ...ingredientToSave } = data;
    if (ingredient.id) {
      formData.append("id", ingredient.id ?? "");
    }

    formData.append("name", ingredientToSave.name);
    formData.append("unidadMedida", ingredientToSave.unidadMedida);
    formData.append("porcentaje", ingredientToSave.porcentaje.toString());
    formData.append("precioActual", ingredientToSave.precioActual.toString());
    formData.append("cantidad", ingredientToSave.cantidad.toString());
    formData.append("precioUnitarioActual", ingredientToSave.precioUnitarioActual.toString());

    const { ok } = await createUpdateMerma(formData);

    if (!ok) {
      alert('Ingrediente no se pudo actualizar');
      return;
    }

    router.push('/admin/listPrice');
  };

  return (
      <div className="bg-white p-10 rounded-lg shadow-lg ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
        >
          <div className="w-full">
            <div className="flex flex-col mb-2 font-bold">
              <span>Ingrediente</span>
              <input
                type="text"
                className="p-2 border rounded-md bg-gray-400"
                {...register("name", { required: true })}
              />
            </div>

            <div className="flex flex-col mb-2">
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

            <div className="flex flex-col mb-2 font-bold">
              <span>Porcentaje</span>
              <input
                type="number"
                className="p-2 border rounded-md bg-gray-400 font-bold"
                {...register("porcentaje", { required: true, min: 0 })}
              />
            </div>

            <div className="flex flex-col mb-2 font-bold">
              <span>Precio Actual</span>
              <input
                type="number"
                className="p-2 border rounded-md bg-gray-400 font-bold"
                {...register("precioActual", { required: true, min: 0 })}
              />
            </div>

            <div className="flex flex-col mb-2 font-bold">
              <span>Cantidad</span>
              <input
                type="number"
                className="p-2 border rounded-md bg-gray-400 font-bold"
                {...register("cantidad", { required: true, min: 0 })}
              />
            </div>

            <div className="flex flex-col mb-2 font-bold">
              <span>Precio Unitario Actual</span>
              <Controller
                name="precioUnitarioActual"
                control={control}
                render={({ field }) => (
                  <input
                    type="number"
                    className="p-2 border rounded-md bg-gray-400 font-bold"
                    {...field}
                    readOnly
                  />
                )}
              />
            </div>

            <button className="btn-primary w-full">Guardar</button>
          </div>
        </form>
      </div>
 
  );
};


