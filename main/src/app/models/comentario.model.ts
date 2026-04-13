import { Usuario } from "./usuario.model";

export interface ComentarioAdjunto {
    nombre_original: string;
    nombre_guardado: string;
    url: string;
    tipo: string;
    tamaño: number;
}

export interface Comentario {
    _id?: string;
    descripcion: string;
    asunto: string;
    tipo: 'Comentario' | 'Anuncio';
    usuarioId: string | any;
    usuarioLigado?: string | any;
    adjuntos?: ComentarioAdjunto[];
    createdAt?: string | Date;
}