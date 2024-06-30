"use client";

import { useForm } from "react-hook-form";
import { Category} from "@/interfaces";


import { createUpdateCategory } from "@/actions";
import {useRouter } from 'next/navigation';


interface Props {
  category: Category;
}



interface FormInputs {
  name: string;

  
 
}

export const CategoryForm = ({ category }: Props) => {

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
  
  } = useForm<FormInputs>({
    defaultValues: {
      ...category,
     

    },
  });



 

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { ...categoryToSave } = data;


    if ( category.id ){
      formData.append("id", category.id ?? "");
    }
  
    formData.append("name", categoryToSave.name);
 
   



    const { ok, category:updatedCategory } = await createUpdateCategory(formData);

  

    router.replace(`/admin/category/${ updatedCategory?.id }`)
   

  };

  return (
    
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-lg mx-auto bg-white p-5 shadow-lg rounded-lg">    
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <div className="flex flex-col mb-2 font-bold">
            <span>Nombre</span>
            <input
              type="text"
              className="p-2 border rounded-md bg-gray-400"
              {...register("name", { required: true })}
            />
          </div>
          <div className="flex justify-end mb-5 text-2xl font-bold">
            <button className="w-full bg-gray-400 text-white">Guardar</button>
          </div>
        </div>
      </div>
    </form>
  );
};
