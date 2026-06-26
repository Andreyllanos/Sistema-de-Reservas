import { ReservationRepository } from '../repositories/ReservationRepository';
import { ResourceRepository } from '../repositories/ResourceRepository';
import type { Reservation } from '../types';

export class ReservationService {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly resourceRepository = new ResourceRepository(),
  ) {}

  async list(filters: { fecha?: string; estado?: string; recurso_id?: string } = {}): Promise<Reservation[]> {
    return this.reservationRepository.list(filters);
  }

  async getById(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findById(id);
  }

  async create(input: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> {
    const resource = await this.resourceRepository.findById(input.recurso_id);
    if (!resource) {
      throw new Error('El recurso no existe.');
    }

    if (input.hora_fin <= input.hora_inicio) {
      throw new Error('La hora final debe ser mayor que la inicial.');
    }

    const hasConflict = await this.reservationRepository.hasConflict(input.recurso_id, input.fecha, input.hora_inicio, input.hora_fin);
    if (hasConflict) {
      throw new Error('El recurso ya tiene una reserva en ese horario.');
    }

    return this.reservationRepository.create({ ...input, estado: 'activa' });
  }

  async update(id: number, input: Partial<Omit<Reservation, 'id' | 'created_at'>>): Promise<Reservation | null> {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      throw new Error('Reserva no encontrada.');
    }

    const next = { ...existing, ...input };
    if (next.hora_fin <= next.hora_inicio) {
      throw new Error('La hora final debe ser mayor que la inicial.');
    }

    const hasConflict = await this.reservationRepository.hasConflict(next.recurso_id, next.fecha, next.hora_inicio, next.hora_fin, id);
    if (hasConflict) {
      throw new Error('El recurso ya tiene una reserva en ese horario.');
    }

    return this.reservationRepository.update(id, next);
  }

  async cancel(id: number): Promise<Reservation | null> {
    const existing = await this.reservationRepository.findById(id);
    if (!existing) {
      throw new Error('Reserva no encontrada.');
    }

    return this.reservationRepository.update(id, { estado: 'cancelada' });
  }

  async delete(id: number): Promise<void> {
    return this.reservationRepository.delete(id);
  }
}
