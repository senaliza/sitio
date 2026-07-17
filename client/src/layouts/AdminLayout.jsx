import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  IconBox, IconLayers, IconClipboard, IconCard, IconSparkle,
  IconLogout, IconMenu, IconSign,
} from '../components/Icons.jsx';
import Logo from '../components/Logo.jsx';

const LINKS = [
  { to: '/admin', end: true, label: 'Resumen', icon: IconSparkle },
  { to: '/admin/productos', label: 'Productos', icon: IconBox },
  { to: '/admin/categorias', label: 'Categorías', icon: IconLayers },
  { to: '/admin/pedidos', label: 'Pedidos', icon: IconCard },
  { to: '/admin/cotizaciones', label: 'Cotizaciones', icon: IconClipboard },
  { to: '/admin/contenido', label: 'Contenido', icon: IconSign },
];

const TITULOS = {
  '/admin': 'Resumen general',
  '/admin/productos': 'Gestión de productos',
  '/admin/categorias': 'Categorías y subcategorías',
  '/admin/pedidos': 'Pedidos y pagos',
  '/admin/cotizaciones': 'Solicitudes de cotización',
  '/admin/contenido': 'Textos e información del sitio',
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [abierto, setAbierto] = useState(false);

  const titulo = TITULOS[loc.pathname] || 'Panel administrativo';

  function salir() {
    logout();
    nav('/admin/login', { replace: true });
  }

  return (
    <div className={`admin-shell ${abierto ? 'con-menu' : ''}`} onClick={() => abierto && setAbierto(false)}>
      <aside className={`admin-side ${abierto ? 'abierto' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="marca marca-logo">
          <Logo width={150} textColor="#ffffff" />
          <span className="marca-tag">Admin</span>
        </div>
        <nav className="admin-nav">
          {LINKS.map((l) => {
            const Ico = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'activo' : '')}
                onClick={() => setAbierto(false)}
              >
                <Ico /> {l.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="pie">
          <button onClick={salir}><IconLogout /> Cerrar sesión</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-top">
          <div className="fila" style={{ gap: 12, alignItems: 'center' }}>
            <button className="admin-burger" onClick={() => setAbierto(true)} aria-label="Menú">
              <IconMenu />
            </button>
            <Logo width={110} className="admin-top-logo" textColor="#0f2953" />
            <h1>{titulo}</h1>
          </div>
          <div className="quien">{user?.nombre || user?.email}</div>
        </header>
        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
