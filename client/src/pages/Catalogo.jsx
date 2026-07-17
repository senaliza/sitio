import { Link } from 'react-router-dom';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  IconLayers, IconSign, IconShield, IconVinyl, IconSparkle, IconBox,
  IconDownload, IconPdf, IconWhatsApp, IconArrow,
} from '../components/Icons.jsx';

// Catálogos descargables en PDF. Coloque los archivos en client/public/catalogos/
// con el mismo nombre indicado en "archivo".
const catalogos = [
  {
    Icono: IconLayers,
    titulo: 'Catálogo general',
    descripcion: 'Toda nuestra línea de rótulos, señalización, adhesivos y soluciones a la medida en un solo documento.',
    archivo: 'catalogo-general.pdf',
    meta: 'PDF · ~4 MB',
    destacado: true,
  },
  {
    Icono: IconSign,
    titulo: 'Rótulos',
    descripcion: 'Rótulos para fachadas, negocios y comercios con materiales duraderos.',
    archivo: 'catalogo-rotulos.pdf',
    meta: 'PDF · ~2 MB',
  },
  {
    Icono: IconShield,
    titulo: 'Señalización',
    descripcion: 'Señales de seguridad e informativas conforme a normativa.',
    archivo: 'catalogo-senalizacion.pdf',
    meta: 'PDF · ~2.6 MB',
  },
  {
    Icono: IconBox,
    titulo: 'Señalización industrial',
    descripcion: 'Señalización para plantas, bodegas y zonas industriales.',
    archivo: 'catalogo-senalizacion-industrial.pdf',
    meta: 'PDF · ~3.3 MB',
  },
  {
    Icono: IconVinyl,
    titulo: 'Adhesivos',
    descripcion: 'Adhesivos decorativos y publicitarios de corte e impresos.',
    archivo: 'catalogo-viniles.pdf',
    meta: 'PDF · ~2 MB',
  },
  {
    Icono: IconSparkle,
    titulo: 'Personalizados',
    descripcion: 'Soluciones visuales a la medida de su proyecto y marca.',
    archivo: 'catalogo-personalizados.pdf',
    meta: 'PDF · ~2 MB',
  },
];

export default function Catalogo() {
  const { contacto } = useContenido();

  return (
    <>
      <section className="page-head">
        <div className="contenedor">
          <h1 className="seccion-titulo">Descargue nuestros catálogos</h1>
          <p style={{ maxWidth: 620 }}>
            Consulte toda nuestra oferta en formato PDF. Descárguelos para revisarlos cuando quiera o compartirlos con su equipo.
          </p>
        </div>
      </section>

      <section className="seccion" style={{ paddingTop: 56 }}>
        <div className="contenedor">
          <div className="cat-grid">
            {catalogos.map((c, i) => {
              const { Icono } = c;
              return (
                <Reveal
                  as="a"
                  key={c.titulo}
                  delay={(i % 3) * 90}
                  className={`cat-card card ${c.destacado ? 'cat-card--dest' : ''}`}
                  href={`/catalogos/${c.archivo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="cat-card-top">
                    <span className="cat-ico"><Icono size={28} /></span>
                    {c.destacado && <span className="badge badge-amarillo">Recomendado</span>}
                  </div>
                  <h3 className="cat-titulo">{c.titulo}</h3>
                  <p className="cat-desc">{c.descripcion}</p>
                  <div className="cat-foot">
                    <span className="cat-meta"><IconPdf size={16} /> {c.meta}</span>
                    <span className="cat-btn btn btn-primario btn-sm">
                      <IconPdf size={16} /> Ver PDF
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Banda de ayuda */}
          <Reveal as="div" className="cat-ayuda card">
            <div>
              <h3>¿Prefiere un catálogo impreso o personalizado?</h3>
              <p className="muted">Escríbanos por WhatsApp y con gusto le enviamos el material que necesita o una propuesta a la medida.</p>
            </div>
            <div className="cat-ayuda-acc">
              <a className="btn btn-wsp" href={linkWhatsApp(contacto.whatsapp, 'Hola, quisiera recibir un catálogo.')} target="_blank" rel="noreferrer">
                <IconWhatsApp size={18} /> Solicitar por WhatsApp
              </a>
              <Link to="/productos" className="btn btn-fantasma">Ver productos <IconArrow size={17} /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .cat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .cat-card { display: flex; flex-direction: column; padding: 28px; cursor: pointer; }
        .cat-card--dest { grid-column: span 1; border-color: rgba(245,158,11,0.35);
          background: linear-gradient(170deg, #fffaf0, #ffffff 60%); }
        .cat-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .cat-ico { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 15px;
          background: var(--grad-marca); color: #fff; box-shadow: 0 10px 22px rgba(34,131,228,0.25);
          transition: transform var(--transicion); }
        .cat-card--dest .cat-ico { background: var(--grad-calido); box-shadow: 0 10px 22px rgba(236,95,34,0.25); }
        .cat-card:hover .cat-ico { transform: translateY(-2px) scale(1.04); }
        .cat-titulo { font-size: 1.2rem; margin-bottom: 8px; }
        .cat-desc { color: var(--texto-suave); font-size: 0.93rem; flex: 1; margin-bottom: 20px; }
        .cat-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .cat-meta { display: inline-flex; align-items: center; gap: 7px; font-size: 0.82rem; font-weight: 700;
          color: var(--gris-600); }
        .cat-meta svg { color: var(--rojo); }
        .cat-card:hover .cat-btn { transform: translateY(-2px); box-shadow: 0 18px 40px rgba(34,131,228,0.34); }

        .cat-ayuda { margin-top: 32px; padding: 30px 32px; display: flex; align-items: center;
          justify-content: space-between; gap: 24px; flex-wrap: wrap;
          background: linear-gradient(135deg, var(--azul-50), #fff); }
        .cat-ayuda:hover { transform: none; box-shadow: var(--sombra); }
        .cat-ayuda h3 { font-size: 1.2rem; margin-bottom: 6px; }
        .cat-ayuda-acc { display: flex; gap: 12px; flex-wrap: wrap; }

        @media (max-width: 980px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 620px) { .cat-grid { grid-template-columns: 1fr; }
          .cat-ayuda { flex-direction: column; align-items: flex-start; } }
      `}</style>
    </>
  );
}
