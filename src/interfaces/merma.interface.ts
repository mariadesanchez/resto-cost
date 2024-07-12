

export interface Merma {
  id: string;
  name: string;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  porcentaje: number;
  precioActual: number;
  cantidad: number;
  precioUnitarioActual: number;
  productId?: string | null; // Make this optional and allow null
}

