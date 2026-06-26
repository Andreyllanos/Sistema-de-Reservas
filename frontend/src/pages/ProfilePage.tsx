import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Mi Perfil</h2>
          <p>Información de la cuenta autenticada.</p>
        </div>
      </div>

      <div className="card">
        <div className="profile-grid">

          <div className="profile-item">
            <span>Nombre</span>
            <strong>{user.nombre}</strong>
          </div>

          <div className="profile-item">
            <span>Correo electrónico</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-item">
            <span>Rol</span>
            <strong>{user.rol === 'admin' ? 'Administrador' : 'Usuario'}</strong>
          </div>

          <div className="profile-item">
            <span>Mi ID</span>
            <strong>#{user.id}</strong>
          </div>

          <div className="profile-item">
            <span>Fecha de registro</span>
            <strong>
              {new Date(user.created_at).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </div>

        </div>
      </div>
    </div>
  );
}