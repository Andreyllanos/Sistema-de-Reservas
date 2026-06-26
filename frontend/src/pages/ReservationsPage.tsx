import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  cancelReservation,
  createReservation,
  getReservations,
  updateReservation,
} from '../services/reservationService';
import { getResources } from '../services/resourceService';
import type {
  Reservation,
  ReservationState,
  Resource,
} from '../types';

const initialForm = {
  recurso_id: '',
  fecha: '',
  hora_inicio: '',
  hora_fin: '',
  estado: 'activa' as ReservationState,
};

export default function ReservationsPage() {
  const { token } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    fecha: '',
    estado: '',
    recurso_id: '',
  });

  const [form, setForm] = useState(initialForm);

  const [error, setError] = useState('');

  async function loadData() {
    try {
      const [reservationsData, resourcesData] = await Promise.all([
        getReservations(filters),
        getResources(),
      ]);

      setReservations(reservationsData);
      setResources(resourcesData);
    } catch {
      setError('No fue posible cargar la información.');
    }
  }

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, filters]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError('');

    try {
      if (editingId) {
        await updateReservation(editingId, {
          recurso_id: Number(form.recurso_id),
          fecha: form.fecha,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
          estado: form.estado,
        });
      } else {
        await createReservation({
          recurso_id: Number(form.recurso_id),
          fecha: form.fecha,
          hora_inicio: form.hora_inicio,
          hora_fin: form.hora_fin,
        });
      }

      setEditingId(null);
      setForm(initialForm);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible guardar la reserva.',
      );
    }
  }

  function handleEdit(reservation: Reservation) {
    setEditingId(reservation.id);

    setForm({
      recurso_id: reservation.recurso_id.toString(),
      fecha: reservation.fecha,
      hora_inicio: reservation.hora_inicio,
      hora_fin: reservation.hora_fin,
      estado: reservation.estado,
    });
  }

  async function handleCancel(id: number) {
    if (!window.confirm('¿Cancelar esta reserva?')) {
      return;
    }

    await cancelReservation(id);

    await loadData();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Reservas</h2>
      </div>

      <div className="grid-2">

        <form className="card" onSubmit={handleSubmit}>

          <h3>
            {editingId
              ? 'Editar reserva'
              : 'Crear reserva'}
          </h3>

          {error && <div className="error">{error}</div>}

          <label>
            Recurso

            <select
              value={form.recurso_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  recurso_id: e.target.value,
                })
              }
              required
            >
              <option value="">
                Seleccione un recurso
              </option>

              {resources.map((resource) => (
                <option
                  key={resource.id}
                  value={resource.id}
                >
                  {resource.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha

            <input
              type="date"
              value={form.fecha}
              onChange={(e) =>
                setForm({
                  ...form,
                  fecha: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Hora inicio

            <input
              type="time"
              value={form.hora_inicio}
              onChange={(e) =>
                setForm({
                  ...form,
                  hora_inicio: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Hora fin

            <input
              type="time"
              value={form.hora_fin}
              onChange={(e) =>
                setForm({
                  ...form,
                  hora_fin: e.target.value,
                })
              }
              required
            />
          </label>

          <button type="submit">
            {editingId
              ? 'Guardar cambios'
              : 'Crear reserva'}
          </button>

        </form>

        <div className="card">

          <h3>Filtros</h3>

          <div className="filters">

            <input
              type="date"
              value={filters.fecha}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fecha: e.target.value,
                })
              }
            />

            <select
              value={filters.estado}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  estado: e.target.value,
                })
              }
            >
              <option value="">Todos</option>
              <option value="activa">Activa</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </select>

            <select
              value={filters.recurso_id}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  recurso_id: e.target.value,
                })
              }
            >
              <option value="">
                Todos
              </option>

              {resources.map((resource) => (
                <option
                  key={resource.id}
                  value={resource.id}
                >
                  {resource.nombre}
                </option>
              ))}
            </select>

          </div>

          <table>

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Recurso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {reservations.map((reservation) => {

                const resource = resources.find(
                  (r) => r.id === reservation.recurso_id,
                );

                return (
                  <tr key={reservation.id}>

                    <td>{reservation.fecha}</td>

                    <td>
                      {reservation.hora_inicio} - {reservation.hora_fin}
                    </td>

                    <td>
                      {resource?.nombre ?? reservation.recurso_id}
                    </td>

                    <td>{reservation.estado}</td>

                    <td>

                      <div className="actions">

                        <button
                          onClick={() => handleEdit(reservation)}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleCancel(reservation.id)
                          }
                        >
                          Cancelar
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}