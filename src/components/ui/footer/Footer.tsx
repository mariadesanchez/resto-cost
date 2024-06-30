import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-2xl mb-10 mt-20 ">

      <Link
        href='/'
      >
        <span className={`${ titleFont.className } antialiased font-bold  text-black`}>Cocina </span>
        <span  className={`${ titleFont.className } antialiased font-bold  text-black`}>| Blanch </span>
        <span className={`${ titleFont.className } antialiased font-bold  text-black`}>© { new Date().getFullYear() }</span>
      </Link>

      <Link
        href='/'
        className={`${ titleFont.className } antialiased font-bold  text-black`}
      >
        Privacidad & Legal
      </Link>

      <Link
        href='/'
        className={`${ titleFont.className } antialiased font-bold  text-black`}
      >
        Ubicación
      </Link>


    </div>
  )
}