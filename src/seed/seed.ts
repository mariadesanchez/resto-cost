import bcryptjs from 'bcryptjs';

interface SeedProduct {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: ValidSizes[];
  slug: string;
  tags: string[];
  title: string;
  type: ValidTypes;
}

interface SeedIngrediente {
  name: string;
  slug: string;
  cantidadReceta: number;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma: number;
  precioConMerma: number;
  productId: string;
}

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

type ValidSizes = 'CH' | 'M' | 'G';
type ValidTypes = 'pastas' | 'carne' | 'vegetales' | 'pescados' | 'tragos' | 'dulces';

interface SeedData {
  users: SeedUser[];
  categories: string[];
  products: SeedProduct[];
  ingredientes: SeedIngrediente[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'fernando@google.com',
      name: 'Fernando Herrera',
      password: bcryptjs.hashSync('123456'),
      role: 'admin',
    },
    {
      email: 'melissa@google.com',
      name: 'Melissa Flores',
      password: bcryptjs.hashSync('123456'),
      role: 'admin',
    },
  ],

  categories: ['Pastas', 'Carne', 'Vegetales', 'Pescados', 'Tragos', 'Dulces'],

  products: [
    {
      id: '270683a2-8e29-40b2-808e-17e0f4b9f9a4',
      description: 'Introducing the Tesla Chill Collection...',
      images: [
        'https://res.cloudinary.com/dluveuqnm/image/upload/v1716432056/w2mucfmncg0abewcsebh.jpg',
      ],
      inStock: 7,
      price: 75,
      sizes: ['CH', 'M', 'G'],
      slug: 'mens_chill_crew_neck_sweatshirt',
      type: 'carne',
      tags: ['sweatshirt'],
      title: 'Men chill crew neck sweatshirt',
    },
    {
      id: '360683a2-8e29-40b2-808e-17e0f4b9f9a4',
      description: 'Introducing the Tesla Chill Collection...',
      images: [
        'https://res.cloudinary.com/dluveuqnm/image/upload/v1716432056/w2mucfmncg0abewcsebh.jpg',
      ],
      inStock: 7,
      price: 75,
      sizes: ['CH', 'M', 'G'],
      slug: 'lola_lucky',
      type: 'carne',
      tags: ['sweatshirt'],
      title: 'Men chill crew neck sweatshirt',
    },
  ],

  ingredientes: [
    {
      name: 'harina0000',
      slug: 'harina-buena',
      cantidadReceta: 500,
      unidadMedida: 'gramos',
      cantidadConMerma: 480,
      precioConMerma: 50,
      productId: '270683a2-8e29-40b2-808e-17e0f4b9f9a4',
    },
    {
      name: 'harina0000',
      slug: 'harina-buena',
      cantidadReceta: 500,
      unidadMedida: 'gramos',
      cantidadConMerma: 480,
      precioConMerma: 50,
      productId: '360683a2-8e29-40b2-808e-17e0f4b9f9a4',
    },
    {
      name: 'huevo',
      slug: 'huevo-bueno',
      cantidadReceta: 5,
      unidadMedida: 'unidad',
      cantidadConMerma: 5,
      precioConMerma: 10,
      productId: '270683a2-8e29-40b2-808e-17e0f4b9f9a4',
    },
  ],
};
