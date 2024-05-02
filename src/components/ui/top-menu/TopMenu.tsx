// Importaciones necesarias
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5';
import { titleFont } from '@/config/fonts';
import { useCartStore, useUIStore } from '@/store';

export const TopMenu = () => {
  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-5 w-full mb-4">
      {/* Logo */}
      <div>
        <Link href="/">
          <span className={`${titleFont.className} antialiased font-bold`}>
            Lucky
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Géneros */}
      <div className="flex justify-center md:justify-start md:ml-auto">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/men"
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/women"
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/kid"
        >
          Niños
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href="/gender/unisex"
        >
          Unisex
        </Link>
      </div>

      {/* Search */}
      <form className="relative w-full mx-auto mt-4 md:mt-5 md:ml-4">
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          Buscar
        </label>
        <div className="flex items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchOutline className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar por producto, por marca..."
            required
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link href={`/search/${encodeURIComponent(searchQuery)}`}>
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Buscar
            </button>
          </Link>
        </div>
      </form>

      {/* Right Menu */}
      <div className="flex items-center mt-4 md:mt-0 md:ml-auto">
        {/* Carrito y Menú */}
        <Link href={(totalItemsInCart === 0 && loaded) ? '/empty' : "/cart"} className="mx-2">
          <div className="relative">
            {(loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
