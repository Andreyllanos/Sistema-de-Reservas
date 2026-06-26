import { pool } from '../config/database';
import type { Reservation } from '../types';

export class ReservationRepository {
  async list(filters: { fecha?: string; estado?: string; recurso_id?: string } = {}): Promise<Reservation[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (filters.fecha) {
      conditions.push(`fecha = $${index}`);
      values.push(filters.fecha);
      index += 1;
    }
    if (filters.estado) {
      conditions.push(`estado = $${index}`);
      values.push(filters.estado);
      index += 1;
    }
    if (filters.recurso_id) {
      conditions.push(`recurso_id = $${index}`);
      values.push(Number(filters.recurso_id));
      index += 1;
    }

    const query = `SELECT * FROM cba_reservas${conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''} ORDER BY fecha DESC, hora_inicio DESC`;
    const result = await pool.query(query, values);
    return result.rows as Reservation[];
  }

  async findById(id: number): Promise<Reservation | null> {
    const result = await pool.query('SELECT * FROM cba_reservas WHERE id = $1', [id]);
    return result.rows[0] as Reservation | null;
  }

  async create(input: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> {
    const result = await pool.query(
      `
        INSERT INTO cba_reservas (usuario_id, recurso_id, fecha, hora_inicio, hora_fin, estado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, usuario_id, recurso_id, fecha, hora_inicio, hora_fin, estado, created_at
      `,
      [input.usuario_id, input.recurso_id, input.fecha, input.hora_inicio, input.hora_fin, input.estado],
    );
    return result.rows[0] as Reservation;
  }

  async update(id: number, input: Partial<Omit<Reservation, 'id' | 'created_at'>>): Promise<Reservation | null> {
    const entries = Object.entries(input);
    if (entries.length === 0) {
      return this.findById(id);
    }

    const fields = entries.map(([key], index) => `${key} = $${index + 1}`).join(', ');
    const values = entries.map(([, value]) => value);
    values.push(id);

    const result = await pool.query(
      `UPDATE cba_reservas SET ${fields} WHERE id = $${entries.length + 1} RETURNING id, usuario_id, recurso_id, fecha, hora_inicio, hora_fin, estado, created_at`,
      values,
    );
    return result.rows[0] as Reservation | null;
  }

  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM cba_reservas WHERE id = $1', [id]);
  }

  async hasConflict(recursoId: number, fecha: string, horaInicio: string, horaFin: string, ignoreId?: number): Promise<boolean> {
    const result = await pool.query(
      `
        SELECT 1 FROM cba_reservas
        WHERE recurso_id = $1 AND fecha = $2 AND id <> COALESCE($3, -1)
          AND NOT (hora_fin <= $4 OR hora_inicio >= $5)
        LIMIT 1
      `,
      [recursoId, fecha, ignoreId ?? null, horaInicio, horaFin],
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}
