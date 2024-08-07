'use client';

import React, { useEffect, useState, useCallback } from "react";
import { Ingrediente } from "@/interfaces";
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { createUpdateIngrediente, getMermaByName, updateProductPrice, createUpdateMermaIngrediente, getIngredientsByProductId } from "@/actions";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import IngredientsList from "./IngredientsList";

interface Props {

    slug: string;
    productName: string;
    ingrediente?: Ingrediente; // Ahora es opcional
}

interface FormInputs {
  name?: string;
  slug?: string;
  cantidadReceta?: number;
  unidadMedida?: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma?: number;
  precioConMerma?: number;
}

export default function IngredienteForm({ ingrediente, slug, productName }: Props) {

//  const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; }[]>([]);
 const [costoTotal, setCostoTotal] = useState<number>(0);
 const [productId, setProductId] = useState(slug);

 //   Ingrediente:

 const [selectedPrecio, setSelectedPrecio] = useState<number | null>(null);
 const [selectedUnidadMedida, setSelectedUnidadMedida] = useState('');
 const [cantidadReceta, setCantidadReceta] = useState<number | null>(null);
 const [cantidadConMerma, setCantidadConMerma] = useState<number | null>(null);
 const [precioConMerma, setPrecioConMerma] = useState<number | null>(null);
 const [selectedPorcentaje, setSelectedPorcentaje] = useState<number | null>(null);
 const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; }[]>([]);


 const [mermas, setMermas] = useState<{ id: string; name: string; unidadMedida: UnidadMedida; porcentaje: number; precio: number; precioUnitarioActual: number }[]>([]);
 
//   necesito para crear un Ingrediente de Elaboracion:
 

 const [mermaId, setMermaId] = useState('')

//   Obtengo todas las mermas:

useEffect(() => {
 const fetchMermas = async () => {
   try {
     const response = await fetch('/api/mermas');
     const data = await response.json();
     if (data.ok) {
       const filteredMermas = (data.mermas || []).map((merma: any) => ({
         id: merma.id,
         name: merma.name,
         unidadMedida: merma.unidadMedida,
         porcentaje: merma.porcentaje,
         precio: merma.precioActual,
         precioUnitarioActual: merma.precioUnitarioActual,
       }));
       // const sortedMermas = filteredMermas.sort((a: any, b: any) => a.name.localeCompare(b.name));
       setMermas(filteredMermas);
     } else {
       console.error('Error al obtener las mermas:', data.message);
       setMermas([]);
     }
     } catch (error) {
     console.error('Error al obtener las mermas:', error);
     setMermas([]);
     }
     };

    fetchMermas();
    }, []);


  // Busco todos los Ingredientes de ese producto
// traer de la tabla intermedia ProductIngrediente todos los id
// de Ingredientes que tienen el mismo id de Producto
// Tendria todos los Ingredientes asociados a un Producto 👇

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
       const response = await fetch('/api/calculateTotalPrice', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ ingredientes: ingredientesByProduct }),
       });
 
       const data = await response.json();
 
       if (data.ok) {
         // guardo costoTotal
         setCostoTotal(data.total);
         await updateProductPrice(slug, data.total);
       } else {
         console.error(data.message);
       }
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

   // await fetchIngredientesByProductId();

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


 
 // Crear / Actualizar Ingrediente que es una Elaboracion
 
 const handleUpdateMerma = async () => {
   if (productName) {
     const fetchedMermaId = await getMermaByName(productName);
     let result;

     if (fetchedMermaId) {
       setMermaId(fetchedMermaId);
       // Actualiza la merma existente
       result = await createUpdateMermaIngrediente(costoTotal, productName, fetchedMermaId,productId);
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
     <IngredientsList slug ={productId} name ={productName} total = {costoTotal}/>

     </div>
//En este componente lo que hacemos es asociar el producto con sus ingredientes
//y enviamos a DB intermedia ProductIngrediente
     );
}

















