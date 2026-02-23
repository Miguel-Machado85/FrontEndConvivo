import { Usuario } from "./usuario.model";

export interface Comentario {
    id?: string;
    descripcion: string;
    asunto: string;
    usuarioId: string;
    usuarioLigado?: string | null;
    Ligado?: Usuario 
}