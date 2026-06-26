import { useCallback, useEffect, useState } from 'react';
import { getDashboardStats } from '../services/dashboardService';

interface DashboardStats {
  totalRecursos: number;
  totalReservas: number;
  reservasActivas: number;
  reservasCanceladas: number;
}

const initialStats: DashboardStats = {
  totalRecursos: 0,
  totalReservas: 0,
  reservasActivas: 0,
  reservasCanceladas: 0,
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getDashboardStats();
      setStats(response);
    } catch {
      setError('No fue posible cargar las estadísticas del sistema.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="page">
        <h2>Resumen general</h2>
        <div className="card">
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Resumen general</h2>

        <div className="card">
          <p className="error">{error}</p>

          <button onClick={loadDashboard}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Resumen general</h2>

      <div className="stats-grid">
        <div className="card stat-card">
          <h3>Total recursos</h3>
          <p>{stats.totalRecursos}</p>
        </div>

        <div className="card stat-card">
          <h3>Total reservas</h3>
          <p>{stats.totalReservas}</p>
        </div>

        <div className="card stat-card">
          <h3>Reservas activas</h3>
          <p>{stats.reservasActivas}</p>
        </div>

        <div className="card stat-card">
          <h3>Reservas canceladas</h3>
          <p>{stats.reservasCanceladas}</p>
        </div>
      </div>
    </div>
  );
}