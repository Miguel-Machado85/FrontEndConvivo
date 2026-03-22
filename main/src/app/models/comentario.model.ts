import { Usuario } from "./usuario.model";

export interface Comentario {
    _id?: string;
    descripcion: string;
    asunto: string;
    usuarioId: string | any;
    usuarioLigado?: string | any; 
}