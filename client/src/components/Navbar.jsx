import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import { IconCart, IconMenu, IconClose, IconLayers } from "./Icons.jsx";
import Logo from "./Logo.jsx";

const enlaces = [
  { to: "/", label: "Inicio", end: true },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/cotizar", label: "Cotizar" },
  { to: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { unidades } = useCarrito();

  return (
    <header className="nav">
      <div className="contenedor nav-inner">
        <Link to="/" className="logo" onClick={() => setAbierto(false)}>
          <Logo width={150} className="logo-mark" />
        </Link>

        <nav className={`nav-links ${abierto ? "abierto" : ""}`}>
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.end}
              className={({ isActive }) =>
                `nav-link ${isActive ? "activo" : ""}`
              }
              onClick={() => setAbierto(false)}
            >
              {e.label}
            </NavLink>
          ))}
          <Link
            to="/productos"
            className="btn btn-rojo btn-sm nav-cta"
            onClick={() => setAbierto(false)}
          >
            Tienda en línea
          </Link>
        </nav>

        <div className="nav-acciones">
          <Link to="/carrito" className="nav-carrito" aria-label="Carrito">
            <IconCart size={22} />
            {unidades > 0 && <span className="carrito-badge">{unidades}</span>}
          </Link>
          <button
            className="nav-toggle"
            onClick={() => setAbierto((v) => !v)}
            aria-label="Menú"
          >
            {abierto ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    /* Modern crystal / glassmorphism */
    background: rgba(255, 255, 255, 0.58);
    backdrop-filter: blur(22px) saturate(165%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.32);
    box-shadow: 0 4px 20px rgba(15, 41, 83, 0.06);
    transition: box-shadow var(--transicion), background var(--transicion);
  }

  /* Subtle crystal top highlight edge (glass bevel) */
  .nav::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent 8%,
      rgba(255, 255, 255, 0.72) 40%,
      rgba(255, 255, 255, 0.72) 60%,
      transparent 92%
    );
    pointer-events: none;
    z-index: 1;
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 74px;
    padding: 0 22px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    height: 100%;
  }

  .logo-mark {
    display: block;
    width: 190px;
    max-height: 64px;
    height: auto;
    object-fit: contain;
    object-position: center;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    transition: transform var(--transicion);
  }

  .logo:hover .logo-mark {
    transform: scale(1.03);
  }

  .logo-text {
    font-family: var(--fuente-display);
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--azul-900);
    letter-spacing: -0.02em;
  }

  .logo-dot {
    color: var(--rojo);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .nav-link {
    font-weight: 600;
    font-size: 0.96rem;
    color: var(--gris-700);
    position: relative;
    padding: 4px 0;
  }

  .nav-link:hover {
    color: var(--azul-900);
  }

  .nav-link.activo {
    color: var(--azul-900);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 100%;
    bottom: -4px;
    height: 2px;
    background: var(--grad-calido);
    border-radius: 2px;
    transition: right var(--transicion);
  }

  .nav-link:hover::after {
    right: 0;
  }

  .nav-link.activo::after {
    right: 0;
  }

  .nav-cta {
    margin-left: 6px;
  }

  .nav-acciones {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .nav-carrito {
    position: relative;
    color: var(--azul-900);
    display: grid;
    place-items: center;
  }

  .carrito-badge {
    position: absolute;
    top: -8px;
    right: -10px;
    background: var(--rojo);
    color: #fff;
    font-size: 0.68rem;
    font-weight: 700;
    min-width: 18px;
    height: 18px;
    border-radius: 99px;
    display: grid;
    place-items: center;
    padding: 0 4px;
  }

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--azul-900);
    cursor: pointer;
  }

  @media (max-width: 900px) {
    .nav-inner {
      height: 74px;
      padding: 0 20px;
    }

    .logo-mark {
      width: 145px;
      max-height: 50px;
    }

    .nav-toggle {
      display: grid;
      place-items: center;
    }

    .nav-links {
      position: fixed;
      inset: 74px 0 auto 0;
      flex-direction: column;
      gap: 4px;
      /* Glassmorphism for the mobile menu too (more opaque for readability) */
      background: rgba(255, 255, 255, 0.86);
      backdrop-filter: blur(18px) saturate(160%);
      padding: 18px 24px 28px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.45);
      box-shadow: 0 12px 32px rgba(15, 41, 83, 0.12);
      transform: translateY(-130%);
      transition: transform .28s ease;
      align-items: stretch;
    }

    .nav-links.abierto {
      transform: translateY(0);
    }

    .nav-link {
      padding: 12px 0;
      border-bottom: 1px solid rgba(15, 41, 83, 0.06);
    }

    .nav-link::after {
      display: none;
    }

    .nav-cta {
      margin: 12px 0 0;
      text-align: center;
    }
  }
`}</style>
    </header>
  );
}
