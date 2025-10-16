import { Admin } from "./admin.model";
import { Vecino } from "./vecino.model";

export interface Conjunto {
    id?: string;
    nombreConjunto: string;
    ciudad: string;
    direccion: string;
    numeroApartamentos: number;

    admin?: Admin;
    vecinos?:Vecino[]; 
}