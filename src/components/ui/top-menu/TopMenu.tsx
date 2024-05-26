// Importaciones necesaria// Importaciones necesarias
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoSearchOutline, IoCartOutline, IoMenuOutline } from 'react-icons/io5';
import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';
import { getCategories } from '@/actions';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setLoaded(true);

    // Fetch categories
    async function fetchCategories() {
      const categories = await getCategories();
      setCategories(categories);
    }

    fetchCategories();
  }, []);

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-5 w-full mb-4">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold text-black text-3xl`}>
            Cocina | Blanch
          </span>
        </Link>
      </div>

      {/* Géneros */}
      <div className={`${titleFont.className} flex justify-center md:justify-start md:ml-auto text-black`}>
        {categories.map((category) => (
          <Link
            key={category.id}
            className="m-1 p-1 rounded-md transition-all hover:bg-white text-3xl"
            href={`/plato/${category.slug}`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Right Menu */}
      <div className="flex items-center mt-4 md:mt-0 md:ml-auto">
        {/* Carrito y Menú */}
        <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : "/cart"} className="mx-2">
          <div className="relative">
            {(loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute  px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-black text-3xl">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5 text-black text-3xl" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-white"
        >
          <IoMenuOutline className="w-5 h-5 text-black" />
        </button>
      </div>
    </nav>
  );
};
