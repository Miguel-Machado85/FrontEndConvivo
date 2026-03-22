import { Usuario } from "./usuario.model";

export interface Conjunto {
    _id?: string;
    nombreConjunto: string;
    ciudad: string;
    direccion: string;
    numeroApartamentos: number;
    admin?: Usuario;
    vecinos?: Usuario[];
    createdAt?: string;
    updatedAt?: string;
}