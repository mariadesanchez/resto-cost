'use client';
import { useForm } from "react-hook-form";
import { Ingrediente } from "@/interfaces";
// import { createUpdateIngrediente, getMermas, updateProductPrice, getIngredientsByProductId, getProductById } from "@/actions";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from "react";
import { UnidadMedida } from "@/interfaces/unidad.interface";
import { DeleteIngrediente } from "@/components";
import { createUpdateIngrediente, getIngredientsByProductId, getMermas, getProductById, updateProductPrice } from "@/actions";
export {createUpdateIngrediente} from '@/actions';
export {getIngredienteBySlug} from '@/actions'
export {getIngredientsByProductId} from '@/actions'
export {deleteIngredienteById} from '@/actions'
export {getPricesWithMermaByProductId} from '@/actions'


interface Props {
  ingrediente: Ingrediente;
  params: {
    slug: string;
  };
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
  const [productIdForm, setProductIdForm] = useState(slug);

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
        if (mermasData.ok) {
          setMermas(mermasData.mermas || []);
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
  }, [slug, fetchIngredientesByProductId]);

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
              className="p-2 border rounded-md"
              {...register("cantidadReceta", { required: true })}
              onChange={handleCantidadRecetaChange}
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="unidadMedida" className="mb-1">Unidad de Medida</label>
            <select
              id="unidadMedida"
              className="p-2 border rounded-md"
              {...register("unidadMedida", { required: true })}
            >
              <option value="miligramos">miligramos</option>
              <option value="gramos">gramos</option>
              <option value="kilo">kilo</option>
              <option value="mililitros">mililitros</option>
              <option value="litro">litro</option>
              <option value="unidad">unidad</option>
            </select>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="cantidadConMerma" className="mb-1">Cantidad con Merma</label>
            <input
              type="number"
              className="p-2 border rounded-md"
              {...register("cantidadConMerma", { required: true })}
              value={cantidadConMerma || ''}
              readOnly
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="precioConMerma" className="mb-1">Precio con Merma</label>
            <input
              type="number"
              className="p-2 border rounded-md"
              {...register("precioConMerma", { required: true })}
              value={precioConMerma || ''}
              readOnly
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="productId" className="mb-1">Product ID</label>
            <input
              type="text"
              className="p-2 border rounded-md"
              {...register("productId", { required: true })}
              value={productIdForm}
              readOnly
            />
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={`p-2 rounded-md text-white ${isValid ? 'bg-blue-500' : 'bg-gray-500 cursor-not-allowed'}`}
              disabled={!isValid}
            >
              {ingrediente && ingrediente.id ? 'Actualizar' : 'Crear'}
            </button>
            <DeleteIngrediente id={ingrediente.id} onDelete={() => handleDelete(ingrediente.id)} />
          </div>
        </div>
      </form>

      <div className="flex flex-col w-full sm:w-1/2 bg-white p-5 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Ingredientes del Producto</h2>
        <ul>
          {ingredientesByProduct.map((ing) => (
            <li key={ing.id} className="flex justify-between items-center mb-2">
              <span>{ing.name}</span>
              <button
                className="p-2 bg-red-500 text-white rounded-md"
                onClick={() => handleDelete(ing.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Costo Total: ${costoTotal}</h3>
        </div>
      </div>
    </div>
  );
}