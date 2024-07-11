"use client";
"use client";
import { useRouter } from "next/navigation"; // Importa desde next/navigation para Server Components
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { titleFont } from '@/config/fonts';
import Link from 'next/link';

interface Props {
  screenId: string;
  onAfterPrint?: () => Promise<void>; // Opcional y asincrónico
}

export const PrintButton: React.FC<Props> = ({ screenId, onAfterPrint }) => {
  const router = useRouter();

  const captureAndPrint = async () => {
    const screenElement = document.getElementById(screenId);
    if (screenElement) {
      const printButton = document.getElementById("printButton");
      const closeButton = document.getElementById("closeButton");

      // Oculta los botones antes de capturar
      if (printButton) printButton.style.display = "none";
      if (closeButton) closeButton.style.display = "none";

      const canvas = await html2canvas(screenElement, {
        scale: 2,
        useCORS: true,
      });

      // Restaura la visibilidad de los botones después de capturar
      if (printButton) printButton.style.display = "block";
      if (closeButton) closeButton.style.display = "block";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [226.77, 453.54], // 80mm x 160mm en puntos (1 pulgada = 72 puntos)
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Abrir el PDF en una nueva ventana
      pdf.output("dataurlnewwindow");

      // Ejecutar el callback después de imprimir si está presente
      if (onAfterPrint) {
        await onAfterPrint();
      }

      // Redirigir después de imprimir si el screenId es "Screen-Order"
      if (screenId === 'Screen-Order' || screenId === 'Screen') {
        router.push('/');
      }
    } else {
      console.error(`Elemento con id "${screenId}" no encontrado`);
    }
    router.push('/')
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Link href="https://www.facebook.com/profile.php?id=100011471131257" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={30} />
        </Link>
        <span>@/Facebook</span>
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <Link href="https://www.instagram.com/luisbrunoblanch/" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={30} />
        </Link>
        <span>@/Instagram</span>
      </div>
      <div className="flex items-center justify-center gap-2 mb-3">
        <FaWhatsapp size={30} />
        <span>221-5450917</span>
      </div>
      <div>
        <h3 className={`${titleFont.className} antialiased text-2xl text-center font-semibold my-2`}>Gracias Por Visitarnos!</h3>
      </div>
      {/* Botón condicional */}
      {screenId === 'Screen-Order' ? (
        <button
          id="printButton"
          onClick={captureAndPrint}
          className="bg-gray-600 text-lg font-bold w-full text-white p-2 rounded px-6"
        >
          Imprimir
        </button>
      ) : (
        <button
          id="printButton"
          onClick={captureAndPrint}
          className="bg-gray-600 text-lg font-bold w-full text-white p-2 rounded px-6"
        >
          Enviar
        </button>
      )}
    </div>
  );
};
