
'use client'

import { FaWhatsapp } from 'react-icons/fa';
import { useRouter } from 'next/router'; // Asumiendo que estás usando Next.js

interface WhatsAppLinkProps {
  phoneNumber: string; // Definir el tipo de phoneNumber como string
}

export const WhatsAppLink: React.FC<WhatsAppLinkProps> = ({ phoneNumber }) => {
  const router = useRouter();

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}`;
    router.push(url); // Esto abre el enlace en una nueva pestaña
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-3" onClick={openWhatsApp} style={{ cursor: 'pointer' }}>
      <FaWhatsapp size={30} />
      <span>{phoneNumber}</span>
    </div>
  );
};



