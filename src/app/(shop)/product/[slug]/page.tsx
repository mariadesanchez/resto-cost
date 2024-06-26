import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { titleFont } from "@/config/fonts";
import {
  ProductMobileSlideshow,
  ProductSlideshow,
  QuantitySelector,
  SizeSelector,
  StockLabel,
} from "@/components";
import { getProductBySlug} from "@/actions";
 
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;
  // const productOldPrice = await getProductBySlug(slug);
  // const totalPrice = await getPricesWithMermaByProductId(productOldPrice!.id)
  //modificar el precio del producto segun los precios con merma de cada uno de los ingredientes
  // const productTotalPrice = await updateProductPrice(productOldPrice!.id,totalPrice )
  // Define the base URL for resolving images
  const metadataBase = new URL("https://misitioweb.com"); // Cambia esto a la URL de tu sitio web
  const product = await getProductBySlug(slug);
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []

  return {
    metadataBase,
    title: product?.title ?? "Producto no encontrado",
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "Producto no encontrado",
      description: product?.description ?? "",
      images: product?.images ? product.images.map(image => `${metadataBase}/products/${image}`) : [],
    },
  };
}

export default async function ProductBySlugPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2 ">
        {/* Mobile Slideshow */}
        <ProductMobileSlideshow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        {/* Desktop Slideshow */}
        <ProductSlideshow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      {/* Detalles */}
      <div className="col-span-1 px-5">
        {/* <StockLabel slug={product.slug} /> */}

        <h1 className={` ${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        { product.inStock > 0 &&
        <p className="text-lg mb-5">${product.price}</p>
         }
        <AddToCart product={ product } />

        {/* Descripción */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
