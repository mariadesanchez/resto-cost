"use client";

import { useForm } from "react-hook-form";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import Image from "next/image";
import clsx from "clsx";
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] };
  categories: Category[];
}

const sizes = ["CH", "M", "G"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string;
  plato: "carne" | "pastas" | "kid" | "vegetales" | "pescados";
  categoryId: string;
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(", "),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  watch("sizes");

  const onSizeChanged = (size: string) => {
    const sizes = new Set(getValues("sizes"));
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);
    setValue("sizes", Array.from(sizes));
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = new FormData();
    const { images, ...productToSave } = data;

    if (product.id) {
      formData.append("id", product.id ?? "");
    }

    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("plato", productToSave.plato);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { ok, product: updatedProduct } = await createUpdateProduct(formData);

    if (!ok) {
      alert('Producto no se pudo actualizar');
      return;
    }

    const selectedCategory = categories.find(category => category.id === productToSave.categoryId);
    if (selectedCategory?.name === "Elaboraciones") {
      router.replace(`/admin/elaboraciones/${updatedProduct?.slug}`);
      router.push('/admin/elaboraciones');
    } else {
      router.replace(`/admin/product/${updatedProduct?.slug}`);
      router.push('/admin/products');
    }
  };

  const title = watch('title');
  useEffect(() => {
    if (title) {
      const slug = title
        .trim()
        .toLowerCase()
        .normalize("NFD") // Descompone los caracteres unicode
        .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
        .replace(/\s+/g, '_'); // Reemplaza los espacios por _
      setValue('slug', slug);
    }
  }, [title, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2 font-bold">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-400"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2 font-bold">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-400 font-bold"
            {...register("slug", { required: true })}
            readOnly // Para que el campo sea de solo lectura
            value={watch('slug')} // El valor se obtiene del hook watch
          />
        </div>

        <div className="flex flex-col mb-2 font-bold">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-400"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2 font-bold">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-400 font-bold"
            {...register("price", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2 font-bold">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-400 font-bold"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2 font-bold">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-400 font-bold"
            {...register("categoryId", { required: true })}
          >
            <option value="">[Seleccione]</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full">Guardar</button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2 font-bold">
          <span>Inventario</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-400 font-bold"
            {...register("inStock", { required: true, min: 0 })}
          />
        </div>

        {/* As checkboxes */}
        <div className="flex flex-col font-bold">
          <span>Porción</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              // bg-blue-500 text-white <--- si está seleccionado
              <div
                key={size}
                onClick={() => onSizeChanged(size)}
                className={clsx(
                  "p-2 border cursor-pointer rounded-md mr-2 mb-2 w-14 transition-all text-center",
                  {
                    "bg-blue-500 text-white": getValues("sizes").includes(size),
                  }
                )}
              >
                <span>{size}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col mb-2 font-bold">
            <span>Fotos</span>
            <input
              type="file"
              { ...register('images') }
              multiple
              className="p-2 border rounded-md bg-gray-400 "
              accept="image/png, image/jpg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product.images?.map((imageUrl: any) => (
              <div key={imageUrl.id}>
                <Image
                  alt={product.title ?? ""}
                  src={imageUrl}
                  width={300}
                  height={300}
                  className="rounded-t shadow-md"
                />

                <button
                  type="button"
                  onClick={() => deleteProductImage(imageUrl)}
                  className="btn-danger w-full rounded-b-xl"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};


