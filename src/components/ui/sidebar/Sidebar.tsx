"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoAppsOutline,
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoRestaurantOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

import { useUIStore } from "@/store";
import { logout } from "@/actions";
import { titleFont } from "@/config/fonts";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-40" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[250px] h-screen bg-grey-500 z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer text-white"
          onClick={() => closeMenu()}
        />

        {/* Menú */}
        {isAuthenticated && (
          <>
            {/* <Link
              href="/profile"
              onClick={() => closeMenu()}
              className={`${titleFont.className}  text-white flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-allm`}
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Perfil</span>
            </Link> */}

            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2
               hover:bg-gray-600 rounded transition-all text-white`}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Mis Ordenes</span>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            className="flex w-full items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all  text-white"
            onClick={() => logout()}
          >
            <IoLogOutOutline size={30} />
            <span className={`${titleFont.className} ml-3 text-xl`} style={{ color: "white" }}>Salir</span>
          </button>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all text-white`}
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl" style={{ color: "white" }}>Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-400 my-10" />

            <Link
              href="/admin/products"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all text-white`}
            >
              <IoRestaurantOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Platos</span>
            </Link>

            <Link
              href="/admin/categories"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all text-white`}
            >
              <IoAppsOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Categorías</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all text-white`}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Ordenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-600 rounded transition-all text-white`}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "white" }}>Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
