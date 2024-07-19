
// interfaces.ts
export interface Category {
  id: string;
  name: string;
}
export interface Product {
  images: any;
  id: string;
  description: string;
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  category: Category; // Añadir esto


 
}

export interface CartProduct {
  mesa: any;
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
  inStock: number;
  
}


export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}


export type Size = 'CH'|'M'|'G';


