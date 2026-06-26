export type UserRole = 'admin' | 'usuario';
export type ResourceState = 'disponible' | 'mantenimiento' | 'ocupado';
export type ReservationState = 'activa' | 'cancelada' | 'completada';

export interface User {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: UserRole;
  created_at: string;
}

export interface Resource {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  estado: ResourceState;
  created_at: string;
}

export interface Reservation {
  id: number;
  usuario_id: number;
  recurso_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: ReservationState;
  created_at: string;
}

export interface AuthPayload {
  userId: number;
  role: UserRole;
  email: string;
}

export interface DashboardStats {
  totalRecursos: number;
  totalReservas: number;
  reservasActivas: number;
  reservasCanceladas: number;
}
