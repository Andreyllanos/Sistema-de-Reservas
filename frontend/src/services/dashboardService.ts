import api from '../api/client';

export async function getDashboardStats(): Promise<{ totalRecursos: number; totalReservas: number; reservasActivas: number; reservasCanceladas: number }> {
  const response = await api.get('/dashboard');
  return response.data;
}
