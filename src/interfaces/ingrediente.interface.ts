export interface Ingrediente {
  id: string;
  slug: string;
  name: string;
  cantidadReceta: number;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma: number;
  precioConMerma: number;

}



