export enum EstadoPago {
  Pending = 'Pending',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export enum EstadoCobranza {
  Activo = 'Activo',
  Inactivo = 'Inactivo',
}

export interface PaymentDetail {
  usuarioId?: string;
  estado: EstadoPago;
  fechaPago?: Date;
  montoReal?: number;
  isSimulated?: boolean;
  motivoRechazo?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeError?: string;
}

export interface PaymentDetailWithUser {
  usuarioId?: {
    _id?: string;
    nombreCompleto?: string;
    numeroApartamento?: number;
  };
  estado: EstadoPago;
  fechaPago?: Date;
  montoReal?: number;
  isSimulated?: boolean;
  motivoRechazo?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeError?: string;
}

export interface Payment {
  _id?: string;
  conjuntoId: string;
  descripcion: string;
  monto: number;
  fechaDebida: Date;
  fechaCreacion?: Date;
  estado: EstadoCobranza;
  created_by?: string;
  detalles?: PaymentDetail[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentWithStats extends Payment {
  pagadosCount: number;
  totalCount: number;
  pendientesCount?: number;
  vencidosCount?: number;
  porcentajePagados: number;
  stats?: {
    totalCount: number;
    pagadosCount: number;
    pendientesCount: number;
    vencidosCount: number;
    porcentajePagados: number;
  };
}

export interface MiPago {
  pagoId: string;
  descripcion: string;
  monto: number;
  fechaDebida: Date;
  estado: EstadoPago;
  fechaPago?: Date;
  montoReal?: number;
  isSimulated?: boolean;
  createdAt?: Date;
}
