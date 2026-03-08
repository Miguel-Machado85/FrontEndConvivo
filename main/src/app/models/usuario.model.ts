export enum Rol {
    Vecino = 'vecino',
    Administrador = 'administrador'
}

export interface Usuario {
    _id?: string;
    nombreCompleto: string;
    correo: string;
    password: string;
    rol: Rol;
    conjuntoId: string | any;
    telefono: string;
    numeroApartamento?: number; // solo vecinos
}