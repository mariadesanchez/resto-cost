
export interface Merma {
  id: string;
  name: string;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  porcentaje: number;
  precioAnterior: number;
  precioActual: number;
  cantidad: number;
  precioUnitarioActual: number;

}