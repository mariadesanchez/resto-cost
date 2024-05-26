'use client';
import { useForm } from "react-hook-form";
import { Ingrediente } from "@/interfaces";
import { createUpdateIngrediente, getMermas, IngredienteByProductId, getProductById } from "@/actions";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { DeleteIngrediente } from "@/components";

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
  productId: string;
}

export default function IngredienteForm({ ingrediente, params }: Props) {
  const { slug } = params;
  const [productIdForm, setProductIdForm] = useState(slug); // Inicializar con el valor almacenado

  const router = useRouter();
  const [selectedPorcentaje, setSelectedPorcentaje] = useState<number | null>(null);
  const [selectedPrecio, setSelectedPrecio] = useState<number | null>(null);
  const [cantidadReceta, setCantidadReceta] = useState<number | null>(ingrediente?.cantidadReceta || null);
  const [mermas, setMermas] = useState<{ id: string; name: string; porcentaje: number; precio: number; }[]>([]);
  const [ingredientesByProduct, setIngredientesByProduct] = useState<{ id: string; slug: string; name: string; cantidadReceta: number; unidadMedida: UnidadMedida; cantidadConMerma: number; precioConMerma: number; productId: string }[]>([]);
  const [cantidadConMerma, setCantidadConMerma] = useState<number | null>(null);
  const [precioConMerma, setPrecioConMerma] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [costoTotal, setCostoTotal] = useState<number>(0);  

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
        const product = await getProductById(slug);
        setProductName(product?.title || '');
      } catch (error) {
        console.error('Error al obtener el Producto:', error);
      }
    };

    fetchProduct();
  }, [slug]);

  const fetchIngredientesByProductId = async () => {
    try {
      const ingredientesByProductId = await IngredienteByProductId(slug);
      setIngredientesByProduct(ingredientesByProductId);
    } catch (error) {
      console.error('Error al obtener los ingredientes:', error);
    }
  };

  useEffect(() => {
    fetchIngredientesByProductId();
  }, [slug]);

  useEffect(() => {
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
      productId: productIdForm,
    },
  });

  useEffect(() => {
    setValue('productId', productIdForm);
  }, [productIdForm, setValue]);

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

    await fetchIngredientesByProductId();

    // Agregar el nuevo ingrediente a la lista de ingredientes
    if (updatedIngrediente) {
      setIngredientesByProduct((prevIngredientes) => [
        ...prevIngredientes.filter(i => i.id !== updatedIngrediente.id),
        updatedIngrediente,
      ]);
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

  const handleDelete = (id: string) => {
    setIngredientesByProduct(prevIngredientes => prevIngredientes.filter(ingrediente => ingrediente.id !== id));
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full sm:w-1/2 bg-white p-5 shadow-lg rounded-lg"
      >
        <div className="w-full mb-4">
          <h1 className="text-2xl font-bold mb-4">{productName}</h1>
          <div className="flex flex-col mb-2">
            <label htmlFor="mermasSelect" className="mb-1">Seleccione una merma</label>
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

          <div className="hidden">
            <label htmlFor="slug" className="mb-1">Slug</label>
            <input
              type="text"
              className="p-2 border rounded-md bg-gray-200"
              {...register("slug", { required: true })}
              readOnly
              value={watch('slug')}
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="cantidadReceta" className="mb-1">Cantidad Receta</label>
            <input
              type="number"
              className="p-2 border rounded-md bg-gray-200"
              {...register("cantidadReceta", { required: true, min: 0 })}
              value={cantidadReceta !== null ? cantidadReceta : ''}
              onChange={handleCantidadRecetaChange}
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
            <label className="mb-1">Cantidad Con Merma</label>
            <div className="p-2 border rounded-md bg-gray-200">
              {cantidadConMerma !== null ? cantidadConMerma : ''}
            </div>
          </div>

          <div className="flex flex-col mb-2">
            <label className="mb-1">Precio Con Merma</label>
            <div className="p-2 border rounded-md bg-gray-200">
              {precioConMerma !== null ? precioConMerma : ''}
            </div>
          </div>

          <input
            type="hidden"
            {...register("productId")}
            value={productIdForm}
          />

          <button className="btn-primary w-full p-2 bg-blue-500 text-white rounded-md">Guardar</button>
        </div>

        <div className="w-full">
          {selectedPorcentaje !== null && (
            <div className="flex flex-col mb-2">
              <span>Porcentaje De merma: {selectedPorcentaje}%</span>
            </div>
          )}
          {selectedPrecio !== null && (
            <div className="flex flex-col mb-2">
              <span>Precio De Mercado: ${selectedPrecio}</span>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-red-500">Costo Total: ${costoTotal}</h3>
          </div>
        </div>
      </form>

      <div className="w-full sm:w-1/2 bg-white p-5 shadow-lg rounded-lg">
        <h2 className="text-lg font-bold mb-4">Ingredientes</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Cantidad Receta</th>
              <th className="px-4 py-2 border-b">Unidad de Medida</th>
              <th className="px-4 py-2 border-b">Cantidad con Merma</th>
              <th className="px-4 py-2 border-b">Precio con Merma</th>
              <th className="px-4 py-2 border-b">Eliminar</th>
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
                <td className="px-4 py-2 border-b">
                  <DeleteIngrediente id={ingrediente.id} onDelete={handleDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
