import { Espacio } from "./espacio.model";
import { Usuario } from "./usuario.model";

export interface Reserva {
    _id?: string;
    usuarioId: string;
    espacioId: string | any;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    cantidadPersonas: number;
    estadoReserva?: string;
}