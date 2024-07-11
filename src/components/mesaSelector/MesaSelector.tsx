"use client"; // Asegúrate de que esto esté presente al principio del archivo

import { useState } from 'react';
import { useRouter } from 'next/router';

export const MesaSelector = () => {
  const [mesa, setMesa] = useState('1');
  const router = useRouter();

  const handleRadioChange = (event: any) => {
    const mesaSeleccionada = event.target.value;
    setMesa(mesaSeleccionada);
    router.push(`/orders/${mesaSeleccionada}`);
  };

  return (
    <form className="flex flex-row mt-5 justify-center items-center gap-4">
      {['1', '2', '3', '4', '5'].map((numMesa) => (
        <div key={numMesa}>
          <input
            type="radio"
            id={`mesa-${numMesa}`}
            name="mesa"
            value={numMesa}
            checked={mesa === numMesa}
            onChange={handleRadioChange}
            className="sr-only"
          />
          <label
            htmlFor={`mesa-${numMesa}`}
            className={`cursor-pointer w-16 h-16 flex justify-center items-center rounded-lg bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out ${
              mesa === numMesa ? 'ring ring-indigo-300' : ''
            }`}
          >
            <span className="text-lg font-semibold">{numMesa}</span>
          </label>
        </div>
      ))}
    </form>
  );
};
