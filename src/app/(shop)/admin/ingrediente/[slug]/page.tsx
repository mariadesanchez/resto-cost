'use client'
import { useForm } from "react-hook-form";
import { Ingrediente } from "@/interfaces";
import { createUpdateIngrediente, getMermas, IngredienteByProductId, getProductById } from "@/actions";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { UnidadMedida } from "@/interfaces/unidad.interface";

interface Props {
  ingrediente?: Ingrediente;
  params: {
    productId: string;
  }
}

interface FormInputs {
  name?: string;
  slug?: string;
  cantidadReceta?: number;
  unidadMedida?: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma?: number;
  precioConMerma?: number;
  productId: string;
}

export default function IngredienteForm({ ingrediente, params }: Props) {
  const { productId } = params;
  const [productIdForm, setProductIdForm] = useState('270683a2-8e29-40b2-808e-17e0f4b9f9a4');
  const router = useRouter();
  const [selectedPorcentaje, setSelectedPorcentaje] = useState<number | null>(null);
  const [selectedPrecio, setSelectedPrecio] = useState<number | null>(null);
  const [cantidadReceta, setCantidadReceta] = useState<number | null>(ingrediente?.cantidadReceta || null);
  const [mermas, setMermas] = useState<{ id: string; name: string; porcentaje: number; precio: number; }[]>([]);
  const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; productId: string }[]>([]);
  const [cantidadConMerma, setCantidadConMerma] = useState<number | null>(null);
  const [precioConMerma, setPrecioConMerma] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [costoTotal, setCostoTotal] = useState<number>(0);  // Nuevo estado para almacenar el costo total

  useEffect(() => {
    const fetchMermas = async () => {
      try {
        const mermasData = await getMermas();
        setMermas(mermasData);
      } catch (error) {
        console.error('Error al obtener las mermas:', error);
      }
    };

    fetchMermas();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProductById('270683a2-8e29-40b2-808e-17e0f4b9f9a4');
        setProductName(product?.title || '');  // Aquí se asegura de que siempre se establezca un string
      } catch (error) {
        console.error('Error al obtener el Producto:', error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchIngredientesByProductId = async () => {
      try {
        const ingredientesByProductId = await IngredienteByProductId('270683a2-8e29-40b2-808e-17e0f4b9f9a4');
        setIngredientesByProduct(ingredientesByProductId);
      } catch (error) {
        console.error('Error al obtener los ingredientes:', error);
      }
    };

    fetchIngredientesByProductId();
  }, []);

  useEffect(() => {
    // Calcula el costo total cuando cambie la lista de ingredientes
    const total = ingredientesByProduct.reduce((acc, ingrediente) => acc + ingrediente.precioConMerma, 0);
    setCostoTotal(total);
  }, [ingredientesByProduct]);

  const {
    handleSubmit,
    register,
    formState: { isValid },
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...ingrediente,
      productId, // Establece el valor predeterminado de productId
    },
  });

  const onSubmit = async (data: FormInputs) => {
    console.log("Form data before sending:", data);

    const formData = new FormData();

    if (ingrediente && ingrediente.id) {
      formData.append("id", ingrediente.id);
    }

    formData.append("name", data.name ?? "");
    formData.append("slug", data.slug ?? "");
    formData.append("cantidadReceta", data.cantidadReceta?.toString() ?? "0");
    formData.append("unidadMedida", data.unidadMedida ?? "");
    formData.append("cantidadConMerma", cantidadConMerma?.toString() ?? "0");
    formData.append("precioConMerma", precioConMerma?.toString() ?? "0");
    formData.append("productId", data.productId);

    const { ok, ingrediente: updatedIngrediente } = await createUpdateIngrediente(formData);

    if (!ok) {
      alert('Producto no se pudo actualizar');
      return;
    }

    if (updatedIngrediente?.slug) {
      router.replace(`/admin/ingrediente/${updatedIngrediente.slug}`);
    } else {
      router.push('/admin/ingredientes');
    }
  };

  const name = watch('name');

  useEffect(() => {
    if (name) {
      const slug = name.trim().toLowerCase().replace(/\s+/g, '_');
      setValue('slug', slug);
    }
  }, [name, setValue]);

  const handleMermaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMerma = mermas.find(merma => merma.name === event.target.value);
    if (selectedMerma) {
      setSelectedPorcentaje(selectedMerma.porcentaje);
      setSelectedPrecio(selectedMerma.precio);
    } else {
      setSelectedPorcentaje(null);
      setSelectedPrecio(null);
    }
  };

  const handleCantidadRecetaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setCantidadReceta(isNaN(value) ? null : value);
  };

  useEffect(() => {
    if (cantidadReceta !== null && selectedPorcentaje !== null) {
      setCantidadConMerma(cantidadReceta + (cantidadReceta * selectedPorcentaje / 100));
    } else {
      setCantidadConMerma(null);
    }

    if (selectedPrecio !== null && selectedPorcentaje !== null) {
      setPrecioConMerma(selectedPrecio + (selectedPrecio * selectedPorcentaje / 100));
    } else {
      setPrecioConMerma(null);
    }
  }, [cantidadReceta, selectedPorcentaje, selectedPrecio]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <h1>{productName}</h1>
          <select
            id="mermasSelect"
            className="p-2 border rounded-md bg-gray-200"
            {...register("name", { required: true })}
            onChange={handleMermaChange}
          >
            <option value="">Seleccione una merma</option>
            {mermas.map((merma) => (
              <option key={merma.id} value={merma.name}>
                {merma.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-2 hidden">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
            readOnly
            value={watch('slug')}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Cantidad Receta</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("cantidadReceta", { required: true, min: 0 })}
            value={cantidadReceta !== null ? cantidadReceta : ''}
            onChange={handleCantidadRecetaChange}
          />
        </div>

        <div className="flex flex-col mb-2">
          <label>Unidad de Medida:</label>
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
          <span>Cantidad Con Merma</span>
          <div className="p-2 border rounded-md bg-gray-200">
            {cantidadConMerma !== null ? cantidadConMerma : ''}
          </div>
        </div>

        <div className="flex flex-col mb-2">
          <span>Precio Con Merma</span>
          <div className="p-2 border rounded-md bg-gray-200">
            {precioConMerma !== null ? precioConMerma : ''}
          </div>
        </div>

        <input
          type="hidden"
          {...register("productId")}
          value={productIdForm}
        />

        <button className="btn-primary w-full">Guardar</button>
      </div>

      <div className="w-full">
        {selectedPorcentaje !== null && (
          <div className="flex flex-col mb-2">
            <span>Porcentaje Seleccionado: {selectedPorcentaje}%</span>
          </div>
        )}
        {selectedPrecio !== null && (
          <div className="flex flex-col mb-2">
            <span>Precio Seleccionado: ${selectedPrecio}</span>
          </div>
        )}
         <div className="mt-4">
          <h3 className="text-lg font-bold text-red-500">Costo Total: ${costoTotal}</h3>
        </div>
      </div>

      <div className="w-full mt-8">
        <h2 className="text-lg font-bold mb-4">Ingredientes</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Cantidad Receta</th>
              <th className="px-4 py-2 border-b">Unidad de Medida</th>
              <th className="px-4 py-2 border-b">Cantidad con Merma</th>
              <th className="px-4 py-2 border-b">Precio con Merma</th>
            </tr>
          </thead>
          <tbody>
            {ingredientesByProduct.map((ingrediente) => (
              <tr key={ingrediente.id}>
                <td className="px-4 py-2 border-b">{ingrediente.name}</td>
                <td className="px-4 py-2 border-b">{ingrediente.cantidadReceta}</td>
                <td className="px-4 py-2 border-b">{ingrediente.unidadMedida}</td>
                <td className="px-4 py-2 border-b">{ingrediente.cantidadConMerma}</td>
                <td className="px-4 py-2 border-b">${ingrediente.precioConMerma}</td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
    </form>
  );
}
