import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-xs mb-10">

      <Link
        href='/'
      >
        <span className={`${ titleFont.className } antialiased font-bold  text-white`}>Cocina </span>
        <span  className="mx-3 text-white">| Blanch </span>
        <span className="mx-3 text-white">© { new Date().getFullYear() }</span>
      </Link>

      <Link
        href='/'
        className="mx-3 text-white"
      >
        Privacidad & Legal
      </Link>

      <Link
        href='/'
        className="mx-3 text-white"
      >
        Ubicación
      </Link>


    </div>
  )
}