import Link from 'next/link';
import { IoGridOutline } from 'react-icons/io5';

export default function EmptyPage() {
  return (
    <div className="flex justify-center items-center h-[400px]">

      {/* <IoTableOutline size={ 80 } className="mx-5" /> */}
      {/* <IoGridOutline size={30} mb={3} className="text-green-600" /> */}

      {/* <div className="flex flex-col items-center">
        <h1 className="text-xl font-semibold"> */}
          {/* Mesa Vacía!!!
        </h1>

        <Link  */}
          {/* href='/'
          className="text-blue-500 mt-2 text-4xl"
        >
          Ir a Inicio
        </Link> */}
          <Link
            href="/"
            className={`flex items-center mt-10 p-2 hover:bg-gray-200 rounded transition-all text-black`}
           
          >
            <IoGridOutline size={30} className = "text-green-600" />
            <span className="ml-3 text-xl text-black">Mesa Vacía!!!</span>

            <span className="ml-3 text-xl text-green-600">Ir a Inicio</span>
          </Link>
         
      </div>

      
    
  );
}