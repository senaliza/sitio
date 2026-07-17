import { Link } from 'react-router-dom';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import { IconWhatsApp, IconMail, IconPhone, IconPin } from './Icons.jsx';
import Logo from './Logo.jsx';

export default function Footer() {
  const { contacto } = useContenido();
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor footer-grid">
        <div>
          <div className="fila" style={{ marginBottom: 14 }}>
            <Logo width={150} textColor="#fff" />
          </div>
          <p style={{ color: 'rgba(255,255,255,.65)', maxWidth: 280, fontSize: '0.94rem' }}>
            Soluciones en rótulos, señalización, adhesivos y productos personalizados para empresas y negocios.
          </p>
        </div>

        <div>
          <h4 className="footer-titulo">Enlaces</h4>
          <ul className="footer-lista">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/nosotros">Nosotros</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/cotizar">Cotizar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-titulo">Contacto</h4>
          <ul className="footer-lista">
            <li><a href={`tel:${contacto.telefono}`}><IconPhone size={16} /> {contacto.telefono}</a></li>
            <li><a href={`mailto:${contacto.email}`}><IconMail size={16} /> {contacto.email}</a></li>
            <li><a href={linkWhatsApp(contacto.whatsapp)} target="_blank" rel="noreferrer"><IconWhatsApp size={16} /> WhatsApp</a></li>
            <li><span><IconPin size={16} /> {contacto.direccion}</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="contenedor">© {anio} Señaliza S.A. Todos los derechos reservados.</div>
      </div>

      <style>{`
        .footer { background: var(--azul-900); color: #fff; padding-top: 56px; }
        .footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1.2fr; gap: 40px; padding-bottom: 40px; }
        .footer-titulo { color: #fff; font-size: 0.95rem; margin-bottom: 16px; letter-spacing: .02em; }
        .footer-lista li { margin-bottom: 11px; }
        .footer-lista a, .footer-lista span { color: rgba(255,255,255,.68); font-size: 0.93rem; display: flex; align-items: center; gap: 9px; transition: color .15s; }
        .footer-lista a:hover { color: #fff; }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,.1); padding: 20px 0; font-size: 0.85rem; color: rgba(255,255,255,.55); }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr; gap: 30px; } }
      `}</style>
    </footer>
  );
}
