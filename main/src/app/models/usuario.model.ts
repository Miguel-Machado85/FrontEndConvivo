import { Admin } from "./admin.model";
import { Vecino } from "./vecino.model";

export enum Rol {
    Vecino = 'vecino',
    Administrador = 'administrador'
}

export interface Usuario {
    id?: string;
    nombreCompleto: string;
    correo: string;
    password: string;
    rol: Rol;
    admin?: Admin;
    vecino?: Vecino;
}