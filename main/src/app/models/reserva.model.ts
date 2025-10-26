import { Espacio } from "./espacio.model";
import { Usuario } from "./usuario.model";

export interface Reserva {
    id?: string;
    usuarioId: string;
    espacioId: string;
    fecha: Date;
    horaInicio: string;
    horaFin: string;
    cantidadPersonas: number;
    estadoReserva?: string;
    usuario?: Usuario
    espacio?: Espacio
}