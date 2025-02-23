import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Nav({ isAuthenticated, userRole }) {
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión (por ejemplo, eliminar el token de autenticación)
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Mi Aplicación</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {/* Links públicos, accesibles para todos */}
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
              </>
            ) : (
              <>
                {/* Links protegidos solo si el usuario está autenticado */}
                <li className="nav-item">
                  <Link className="nav-link" to="/employees">Lista de Empleados</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/schedules">Crear Horarios</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/view-records">Ver Registros</Link>
                </li>
                {id && ( 
                  <li className="nav-item">
                    <Link className="nav-link" to={`/view/${id}`}>Ver Horarios</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return <footer>© 2024 Your Company</footer>;
};

export { Nav, Footer };