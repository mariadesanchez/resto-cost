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
  productId: string;

}




interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin'|'user'
}



type ValidSizes = 'CH' | 'M' | 'G';
type ValidTypes = 'pastas' | 'carne' | 'vegetales' | 'pescados'|'tragos'|'dulces';

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
      role: 'admin'
    },
    {
      email: 'melissa@google.com',
      name: 'Melissa Flores',
      password: bcryptjs.hashSync('123456'),
      role: 'admin'
    },


  ],


  categories: [
    'pastas', 'carne', 'vegetales', 'pescados','tragos','dulces'
  ],
 
  
  products: [
    { id :'270683a2-8e29-40b2-808e-17e0f4b9f9a4',
      description: "Introducing the Tesla Chill Collection. The Men’s Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.",
      images: [
        // 'https://res.cloudinary.com/dluveuqnm/image/upload/v1710293571/e98srcvl8tcmrcimyv4n.webp',
        // 'https://res.cloudinary.com/dluveuqnm/image/upload/v1710293571/gwcrkqedzfdvu3kjebw0.webp'
        //  'https://res.cloudinary.com/dluveuqnm/image/upload/v1710782027/k8ja8ugtjhunbkizq6pe.webp',
        //  'https://res.cloudinary.com/dluveuqnm/image/upload/v1710782026/mlfepzep5pyc1hqhmfae.webp' 
        //  'https://collection.cloudinary.com/dluveuqnm/eb733c5746dd38279c346b01dd682c8f?' ,
        //  'https://collection.cloudinary.com/dluveuqnm/1ca1726290ebe5bddba3aeaaa5ed16d9?'
        'https://res.cloudinary.com/dluveuqnm/image/upload/v1716432056/w2mucfmncg0abewcsebh.jpg',
      ],
      inStock: 7,
      price: 75,
      sizes: [ 'CH', 'M', 'G' ],
      slug: "mens_chill_crew_neck_sweatshirt",
      type: 'carne',
      tags: [ 'sweatshirt' ],
      title: "Men’s Chill Crew Neck Sweatshirt",
 
     
    
    },
   
  ],
  
  ingredientes: [
    { 
      name: 'harina0000',
      productId: '270683a2-8e29-40b2-808e-17e0f4b9f9a4',
      // slug: 'harina_buena',
    },
    {
      name: 'huevo',
      // slug: 'huevo_bueno',
      productId: '270683a2-8e29-40b2-808e-17e0f4b9f9a4', // Reemplazar con el ID del producto relacionado
    },
  ]

};
//NO FUNCIONA SeeIngredientes
