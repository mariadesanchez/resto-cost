

export interface Product {
  images: any;
  id: string;
  description: string;
  // images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  // porciones : Porcion[];
  //todo: type: Type;
  plato: Category;
}

export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
  inStock: number;
  // porcion: Porcion;
}


export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}


type Category = "carne" | "pastas" | "kid" | "vegetales"|"pescados";
export type Size = 'CH'|'M'|'G';
// export type Porcion = 'chica'|'mediana'|'grande';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';
export type Plato = "carne" | "pastas" | "kid" | "vegetales"| "pescados";