import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>CBA</h2>
          <p>Sistema de Reservas</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/">
            Dashboard
          </NavLink>

          {user?.rol === 'admin' && (
            <NavLink to="/resources">
              Recursos
            </NavLink>
          )}

          <NavLink to="/reservations">
            Reservas
          </NavLink>

          <NavLink to="/profile">
            Perfil
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <strong>{user?.nombre}</strong>

          <span>
            {user?.rol === 'admin'
              ? 'Administrador'
              : 'Usuario'}
          </span>

          <button onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>CBA Sistema de Reservas</h1>
            <p>
              Gestión profesional de recursos y reservas
            </p>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}