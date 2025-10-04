import { Rol } from "./usuario.model";

export interface UsuarioRequest {
  nombreCompleto: string;
  correo: string;
  password: string;
  rol: Rol;
  conjuntoId: string;
  telefono?: string; 
  numeroApartamento?: number; 
}