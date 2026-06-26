import { type FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from '../services/resourceService';
import type { Resource } from '../types';

const initialForm = {
  nombre: '',
  descripcion: '',
  tipo: '',
  estado: 'disponible',
};

export default function ResourcesPage() {
  const { user } = useAuth();

  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await getResources(search);
      setResources(data);
    } catch {
      setError('No fue posible cargar los recursos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [search]);

  const clearForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');

    try {
      if (editingId !== null) {
        await updateResource(editingId, form);
      } else {
        await createResource(form);
      }

      clearForm();
      await loadResources();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible guardar el recurso.'
      );
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);

    setForm({
      nombre: resource.nombre,
      descripcion: resource.descripcion,
      tipo: resource.tipo,
      estado: resource.estado,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desea eliminar este recurso?')) return;

    try {
      await deleteResource(id);

      if (editingId === id) {
        clearForm();
      }

      await loadResources();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible eliminar el recurso.'
      );
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Recursos</h2>

        <input
          type="text"
          placeholder="Buscar recurso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid-2">
        <form className="card" onSubmit={handleSubmit}>
          <h3>
            {editingId !== null
              ? 'Editar recurso'
              : 'Crear recurso'}
          </h3>

          {error && <div className="error">{error}</div>}

          <label>
            Nombre
            <input
              value={form.nombre}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Descripción
            <input
              value={form.descripcion}
              onChange={(e) =>
                setForm({
                  ...form,
                  descripcion: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Tipo
            <input
              value={form.tipo}
              onChange={(e) =>
                setForm({
                  ...form,
                  tipo: e.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Estado
            <select
              value={form.estado}
              onChange={(e) =>
                setForm({
                  ...form,
                  estado: e.target.value,
                })
              }
            >
              <option value="disponible">Disponible</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="ocupado">Ocupado</option>
            </select>
          </label>

          <div className="actions">
            <button
              type="submit"
              disabled={user?.rol !== 'admin'}
            >
              {editingId !== null
                ? 'Guardar cambios'
                : 'Crear recurso'}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={clearForm}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="card">
          <h3>Listado de recursos</h3>

          {loading ? (
            <p>Cargando...</p>
          ) : resources.length === 0 ? (
            <p>No existen recursos registrados.</p>
          ) : (
            resources.map((resource) => (
              <div
                className="list-item"
                key={resource.id}
              >
                <div>
                  <strong>{resource.nombre}</strong>

                  <p>{resource.descripcion}</p>

                  <small>
                    {resource.tipo} • {resource.estado}
                  </small>
                </div>

                {user?.rol === 'admin' && (
                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(resource)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(resource.id)
                      }
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}