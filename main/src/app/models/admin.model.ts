import { Usuario } from "./usuario.model";
import { Conjunto } from "./conjunto.model";

export interface Admin {
    id?: string;
    conjuntoId: string;
    telefono: string;

    usuario?: Usuario;
    conjunto?: Conjunto; 
}