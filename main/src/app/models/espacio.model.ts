export interface Espacio {
    id?: string;
    nombre: string;
    descripcion: string;
    conjuntoId: string;
    horaInicio: string;
    horaFin: string;
    diasHabilitados: string[];
    estadoEspacio?: string;
    cantidadPersonas: number;
    tiempoMaximo: number;
}