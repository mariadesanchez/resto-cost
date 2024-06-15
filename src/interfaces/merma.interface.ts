
export interface Merma {
  id: string;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  name: string;
  porcentaje: number;
  precio: number;
}