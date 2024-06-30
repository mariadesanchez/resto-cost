"use client";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  screenId: string;
  onAfterPrint?: () => Promise<void>; // Hacemos que onAfterPrint sea opcional y asincrónico
}

export const CaptureAndPrintButton: React.FC<Props> = ({ screenId, onAfterPrint }) => {
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
  };

  return (
    <>
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
          Imprimir y Cerrar Mesa
        </button>
      )}
    </>
  );
};




