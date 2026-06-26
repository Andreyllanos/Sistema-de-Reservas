import api from '../api/client';
import type { Reservation, ReservationState } from '../types';

export interface ReservationFilters {
  fecha?: string;
  estado?: ReservationState | '';
  recurso_id?: string;
}

export interface CreateReservationData {
  recurso_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface UpdateReservationData {
  recurso_id?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  estado?: ReservationState;
}

export async function getReservations(
  filters: ReservationFilters = {},
): Promise<Reservation[]> {
  const response = await api.get('/reservations', {
    params: filters,
  });

  return response.data;
}

export async function createReservation(
  input: CreateReservationData,
): Promise<Reservation> {
  const response = await api.post('/reservations', input);

  return response.data;
}

export async function updateReservation(
  id: number,
  input: UpdateReservationData,
): Promise<Reservation> {
  const response = await api.put(
    `/reservations/${id}`,
    input,
  );

  return response.data;
}

export async function cancelReservation(
  id: number,
): Promise<Reservation> {
  const response = await api.delete(
    `/reservations/${id}`,
  );

  return response.data;
}