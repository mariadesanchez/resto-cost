


// export interface Ingrediente {
//   id: string;
//   slug: string;
//   name: string;
//   cantidadReceta: number;
//   unidadMedida: 'miligramos' | 'gramos' | 'kilo' | 'mililitros' | 'litro' | 'unidad';
//   cantidadConMerma: number;
//   precioConMerma: number;

// }
// src/interfaces/index.ts
import { UnidadMedida } from "@/interfaces/unidad.interface";

export interface Ingrediente {
  id: string;
  name: string;
  unidadMedida: UnidadMedida;
  porcentaje: number;
  precioActual: number;
  cantidad: number;
  precioUnitarioActual: number;
}