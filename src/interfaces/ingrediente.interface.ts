// interfaces.ts
export interface Ingrediente {
  id: string;
  name: string;
  slug?: string;  // Hacer opcional si no siempre está presente
  cantidadReceta: number;
  unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
  cantidadConMerma: number;
  precioConMerma: number;
  productId: string;
}
