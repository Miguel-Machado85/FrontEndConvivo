import { Usuario } from "./usuario.model";

export interface Comentario {
    _id?: string;
    descripcion: string;
    asunto: string;
    tipo: 'Comentario' | 'Anuncio';
    usuarioId: string;
    usuarioLigado?: string | any;
    createdAt?: string | Date;
}