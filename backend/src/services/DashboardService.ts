import { pool } from '../config/database';
import type { DashboardStats } from '../types';

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const [resources, reservations] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total FROM cba_recursos'),
      pool.query('SELECT COUNT(*)::int AS total, SUM(CASE WHEN estado = $1 THEN 1 ELSE 0 END)::int AS activas, SUM(CASE WHEN estado = $2 THEN 1 ELSE 0 END)::int AS canceladas FROM cba_reservas', ['activa', 'cancelada']),
    ]);

    return {
      totalRecursos: Number(resources.rows[0].total),
      totalReservas: Number(reservations.rows[0].total),
      reservasActivas: Number(reservations.rows[0].activas),
      reservasCanceladas: Number(reservations.rows[0].canceladas),
    };
  }
}
