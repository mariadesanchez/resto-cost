'use client';

// import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoGridOutline, IoMenuOutline } from 'react-icons/io5';
import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';
// import { getCategories } from '@/actions';
// import { Category } from '@/interfaces/category.interface';

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  // const [categories, setCategories] = useState<Category[]>([]);

  // useEffect(() => {
    // Fetch categories
    // async function fetchCategories() {
    //   const categories = await getCategories();
      // setCategories(categories);
  //   }

  //   fetchCategories();
  // }, []);

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-5 w-full mb-4 mt-7">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold text-black text-3xl`}>
            Cocina | Blanch
          </span>
        </Link>
      </div>
      
      {/* Categorías - visible en pantallas grandes */}
      <div className={`${titleFont.className} hidden md:flex justify-center md:justify-start md:ml-auto text-black`}>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Carne"
        >
          Carne
        </Link>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Pastas"
        >
          Pastas
        </Link>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Pescados"
        >
          Pescados
        </Link>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Vegetales"
        >
          Vegetales
        </Link>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Tragos"
        >
          Tragos
        </Link>
        <Link
          className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
          href="/plato/Dulces"
        >
          Dulces
        </Link>
      </div>
      
      {/* Right Menu */}
      <div className="flex items-center mt-4 md:mt-0 md:ml-auto">
        {/* Carrito y Menú */}
        <Link href={(totalItemsInCart === 0) ? '/empty' : "/checkout"} className="mx-2">
          <div className="relative">
            {totalItemsInCart > 0 && (
              <span className="fade-in absolute flex items-center justify-center w-6 h-6 rounded-full font-bold -top-4 left-3 bg-blue-700 text-white text-sm">
                {totalItemsInCart}
              </span>
            )}
             <IoGridOutline size={30} mb={3} className="text-green-600" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-white"
        >
          <IoMenuOutline className="w-10 h-10 text-black" />
        </button>
      </div>
    </nav>
  );
};



