import { Conjunto } from "./conjunto.model";
import { Usuario } from "./usuario.model";

export interface Vecino {
    id?: string;
    conjuntoId: string;
    numeroApartamento: number;

    usuario?: Usuario;
    conjunto?: Conjunto; 
}