import { Conjunto } from "./conjunto.model";
import { Usuario } from "./usuario.model";

export interface Vecino {
    id?: string;
    conjuntoId: string;
    numeroApartamento: number;
    telefono: string;
    usuario?: Usuario;
    conjunto?: Conjunto; 
}