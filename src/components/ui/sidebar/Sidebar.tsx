"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  IoAppsOutline,
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoLogoUsd,
  IoPeopleOutline,
  IoRestaurantOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { MdOutlinePriceChange } from "react-icons/md";


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
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-white " />
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
          "fixed p-5 right-0 top-0 w-[250px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer text-black"
          onClick={() => closeMenu()}
        />

        {/* Menú */}
        {isAuthenticated && (
          <>
            {/* <Link
              href="/profile"
              onClick={() => closeMenu()}
              className={`${titleFont.className}  text-black flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-allm`}
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Perfil</span>
            </Link> */}

            <Link
              href="/orders"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2
               hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Mis Ordenes</span>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            className="flex w-full items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all  text-black"
            onClick={() => logout()}
          >
            <IoLogOutOutline size={30} />
            <span className={`${titleFont.className} ml-3 text-xl`} style={{ color: "black" }}>Salir</span>
          </button>
        )}

        {!isAuthenticated && (
          <Link
            href="/auth/login"
            className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            onClick={() => closeMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl" style={{ color: "black" }}>Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className="w-full h-px bg-gray-400 my-10" />

            
            <Link
              href="/admin/precios/listPrice"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoLogoUsd size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Lista De Precios</span>
            </Link>
            <Link
              href="/admin/products"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoRestaurantOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Platos</span>
            </Link>

            <Link
              href="/admin/categories"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoAppsOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Categorías</span>
            </Link>

            <Link
              href="/admin/orders"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Ordenes</span>
            </Link>

            <Link
              href="/admin/users"
              onClick={() => closeMenu()}
              className={`${titleFont.className} flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl" style={{ color: "black" }}>Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
