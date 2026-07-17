import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useContenido } from '../context/ContenidoContext.jsx';
import ProductoCard from '../components/ProductoCard.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import TextoRotativo from '../components/TextoRotativo.jsx';
import CarruselVertical from '../components/CarruselVertical.jsx';
import { IconSign, IconShield, IconVinyl, IconSparkle, IconArrow, IconCheck } from '../components/Icons.jsx';

const servicios = [
  { Icono: IconSign, titulo: 'Rótulos y letreros', texto: 'Rótulos luminosos, letras corpóreas y letreros para fachadas, negocios y comercios.' },
  { Icono: IconShield, titulo: 'Señalización', texto: 'Señales viales, de seguridad e informativas conforme a la normativa vigente.' },
  { Icono: IconVinyl, titulo: 'Adhesivos y rotulación vehicular', texto: 'Adhesivos de corte e impresos, decoración de vitrinas y rotulación de vehículos.' },
  { Icono: IconSparkle, titulo: 'Publicidad a la medida', texto: 'Vallas, banners y soluciones visuales personalizadas para su marca.' },
];

const garantias = [
  { Icono: IconCheck, titulo: 'Atención personalizada', texto: 'Acompañamiento en cada etapa' },
  { Icono: IconShield, titulo: 'Materiales de calidad', texto: 'Durabilidad garantizada' },
  { Icono: IconSparkle, titulo: 'Diseño a la medida', texto: 'Adaptado a su marca' },
  { Icono: IconArrow, titulo: 'Entrega confiable', texto: 'Cumplimiento en tiempo' },
];

export default function Home() {
  const { textos, cargado } = useContenido();
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    api.productos('?destacado=1').then((p) => setDestacados(p.slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      {/* HERO - sin contenedor para que sea más inmersivo / transparente */}
      <section className="hero">
        <div className="hero-glow hero-glow-1" aria-hidden />
        <div className="hero-glow hero-glow-2" aria-hidden />
        <div className="hero-inner">
          <div className="hero-texto">
            <div className="hero-bar" aria-hidden>
              <span style={{ background: '#F92832' }} />
              <span style={{ background: '#094C9F' }} />
              <span style={{ background: '#08A3EA' }} />
              <span style={{ background: '#60BB4D' }} />
              <span style={{ background: '#FEE40E' }} />
            </div>
            {cargado ? (
              <>
                <h1 className="hero-titulo">{textos.hero_titulo}</h1>
                {textos.hero_subtitulo && (
                  <p className="hero-sub">{textos.hero_subtitulo}</p>
                )}
              </>
            ) : (
              <div className="hero-skeleton" aria-hidden>
                <span /><span /><span />
                <span className="hero-skeleton-sub" />
              </div>
            )}
            <div className="hero-rot">
              Fabricamos{' '}
              <TextoRotativo
                className="hero-rot-word"
                palabras={['rótulos luminosos', 'letras corpóreas', 'señalización vial', 'rotulación vehicular', 'adhesivos publicitarios', 'vallas y banners']}
              />
            </div>
            <div className="hero-botones">
              <Link to="/productos" className="btn btn-primario">Ver productos <IconArrow size={18} /></Link>
              <Link to="/cotizar" className="btn btn-rojo">Solicitar cotización</Link>
            </div>
            <ul className="hero-checks">
              <li><IconCheck size={16} /> Atención personalizada</li>
              <li><IconCheck size={16} /> Materiales de calidad</li>
              <li><IconCheck size={16} /> Entrega confiable</li>
            </ul>
          </div>
          <div className="hero-deco" aria-hidden>
            <div className="deco-card deco-1">
              <span className="deco-ico" style={{ background: '#094C9F' }}><IconSign size={24} /></span>
              <div className="deco-txt"><strong>Rótulos</strong><span>Fachadas y luminosos</span></div>
            </div>
            <div className="deco-card deco-2">
              <span className="deco-ico" style={{ background: '#08A3EA' }}><IconVinyl size={24} /></span>
              <div className="deco-txt"><strong>Adhesivos</strong><span>Vehículos Vitrinas</span></div>
            </div>
            <div className="deco-card deco-3">
              <span className="deco-ico" style={{ background: '#60BB4D' }}><IconShield size={24} /></span>
              <div className="deco-txt"><strong>Señalización</strong><span>Vial y de seguridad</span></div>
            </div>
            <div className="deco-card deco-4">
              <span className="deco-ico" style={{ background: '#F92832' }}><IconSparkle size={24} /></span>
              <div className="deco-txt"><strong>A medida</strong><span>Letras corpóreas</span></div>
            </div>
          </div>
        </div>

        {/* Franja de confianza (dentro del hero, sin contenedor para transparencia) */}
        <div className="hero-trust">
          <div className="trust-strip">
            {garantias.map(({ Icono, titulo, texto }) => (
              <div className="trust-item" key={titulo}>
                <span className="trust-ico"><Icono size={20} /></span>
                <div>
                  <strong>{titulo}</strong>
                  <span>{texto}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARRUSEL VERTICAL PREMIUM */}
      <CarruselVertical />

      {/* SERVICIOS */}
      <section className="seccion">
        <div className="contenedor">
          <Reveal>
            <h2 className="seccion-titulo">Soluciones visuales <span className="grad-text">completas</span></h2>
            <p className="seccion-intro">Acompañamos a empresas y negocios con productos visuales que comunican y destacan su marca.</p>
          </Reveal>
          <div className="serv-grid">
            {servicios.map(({ Icono, titulo, texto }, i) => (
              <Reveal as="div" className="serv-card card" key={titulo} delay={i * 90}>
                <span className="serv-icono"><Icono size={26} /></span>
                <h3>{titulo}</h3>
                <p>{texto}</p>
                <Link to="/productos" className="serv-link">Explorar <IconArrow size={15} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <section className="seccion">
        <div className="contenedor">
          <Reveal>
            <h2 className="seccion-titulo">Resultados que respaldan nuestro trabajo</h2>
            <p className="seccion-intro">La confianza de quienes ya destacan su marca con nosotros.</p>
          </Reveal>
          <Reveal as="div" className="metricas-claro">
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={Number(textos.stat_anios) || 0} sufijo="+" /></div>
              <div className="metrica-lbl">Años de experiencia</div>
            </div>
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={Number(textos.stat_proyectos) || 0} sufijo="+" duracion={2100} /></div>
              <div className="metrica-lbl">Proyectos realizados</div>
            </div>
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={Number(textos.stat_clientes) || 0} sufijo="+" duracion={2000} /></div>
              <div className="metrica-lbl">Clientes satisfechos</div>
            </div>
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={Number(textos.stat_satisfaccion) || 0} sufijo="%" /></div>
              <div className="metrica-lbl">Compromiso y calidad</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DESTACADOS */}
      {destacados.length > 0 && (
        <section className="seccion" style={{ background: '#ffffff' }}>
          <div className="contenedor">
            <Reveal className="fila" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 className="seccion-titulo" style={{ marginBottom: 0 }}>Productos destacados</h2>
              </div>
              <Link to="/productos" className="btn btn-fantasma">Ver todo <IconArrow size={17} /></Link>
            </Reveal>
            <div className="dest-grid" style={{ marginTop: 36 }}>
              {destacados.map((p, i) => (
                <Reveal as="div" key={p.id} delay={i * 90}>
                  <ProductoCard producto={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta">
        <div className="cta-glow" aria-hidden />
        <div className="contenedor cta-inner">
          <div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.7rem,3.5vw,2.3rem)' }}>¿Listo para destacar su marca?</h2>
            <p style={{ color: 'rgba(255,255,255,.78)', marginTop: 10 }}>Solicite una cotización sin compromiso y le ayudamos con su proyecto.</p>
          </div>
          <Link to="/cotizar" className="btn btn-rojo">Solicitar cotización ahora <IconArrow size={18} /></Link>
        </div>
      </section>

      <style>{`
        .hero { position: relative; overflow: hidden; padding-bottom: 56px;
          /* Más transparente para que se vea mejor el fondo dinámico (FondoDinamico) */
          background: linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.22) 55%, rgba(255,255,255,0.08) 100%);
          backdrop-filter: blur(2px); }
        .hero::before { content:''; position:absolute; inset:0;
          background-image: radial-gradient(rgba(9,76,159,0.05) 1px, transparent 1px);
          background-size: 28px 28px; opacity: .5; pointer-events:none; }
        .hero-glow { position:absolute; border-radius:50%; filter: blur(90px); pointer-events:none; will-change: transform; }
        .hero-glow-1 { width: 460px; height: 460px; top: -180px; right: -100px; background: rgba(8,163,234,0.20);
          animation: hero-glow-mov1 22s ease-in-out infinite alternate; }
        .hero-glow-2 { width: 420px; height: 420px; bottom: -160px; left: -120px; background: rgba(96,187,77,0.14);
          animation: hero-glow-mov2 26s ease-in-out infinite alternate; }
        @keyframes hero-glow-mov1 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(-70px,60px,0) scale(1.18); } }
        @keyframes hero-glow-mov2 { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(80px,-50px,0) scale(1.15); } }
        @media (prefers-reduced-motion: reduce) { .hero-glow { animation: none !important; } }
        .hero-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 40px; align-items: center; padding: 72px 32px 40px; max-width: 1280px; margin: 0 auto; }

        /* Pill claro (sobre fondo claro del hero) */
        .hero .pill { background: rgba(255,255,255,0.7); border: 1px solid rgba(15,41,83,0.10);
          color: var(--azul-900); box-shadow: var(--sombra); }

        /* Barra de los 5 colores del logo */
        .hero-bar { display: flex; gap: 6px; margin: 22px 0 6px; }
        .hero-bar span { display: block; width: 46px; height: 7px; border-radius: 99px;
          transform-origin: left; animation: hero-bar-in .6s cubic-bezier(.22,1,.36,1) backwards; }
        .hero-bar span:nth-child(2) { animation-delay: .07s; }
        .hero-bar span:nth-child(3) { animation-delay: .14s; }
        .hero-bar span:nth-child(4) { animation-delay: .21s; }
        .hero-bar span:nth-child(5) { animation-delay: .28s; }
        @keyframes hero-bar-in { from { transform: scaleX(0); opacity: 0; } to { transform: scaleX(1); opacity: 1; } }

        .hero-titulo { color: var(--azul-900); font-family: var(--fuente-display);
          font-size: clamp(2.45rem, 6.2vw, 4.75rem); font-weight: 800; line-height: 1.0;
          letter-spacing: -0.025em; margin-top: 12px; }

        /* Placeholder mientras carga el contenido del backend: evita mostrar
           el texto por defecto y que luego cambie (parpadeo). Reserva un alto
           similar al título real para no descuadrar el layout. */
        .hero-skeleton { margin-top: 12px; display: grid; gap: 14px; max-width: 620px; }
        .hero-skeleton span { display: block; height: clamp(38px, 6vw, 66px); border-radius: 12px;
          background: linear-gradient(90deg, rgba(9,76,159,0.07) 25%, rgba(9,76,159,0.15) 37%, rgba(9,76,159,0.07) 63%);
          background-size: 400% 100%; animation: hero-shimmer 1.4s ease infinite; }
        .hero-skeleton span:nth-child(1) { width: 96%; }
        .hero-skeleton span:nth-child(2) { width: 82%; }
        .hero-skeleton span:nth-child(3) { width: 58%; }
        .hero-skeleton .hero-skeleton-sub { height: 20px; width: 70%; margin-top: 10px; border-radius: 8px; }
        @keyframes hero-shimmer { from { background-position: 100% 0; } to { background-position: 0 0; } }
        @media (prefers-reduced-motion: reduce) { .hero-skeleton span { animation: none; } }
        .hero-sub { color: var(--texto-suave); font-size: 1.16rem; margin: 20px 0 16px; max-width: 520px; }
        .hero-rot { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; color: var(--gris-600);
          font-weight: 600; font-size: 1rem; margin-bottom: 30px; }
        .hero-rot-word { font-family: var(--fuente-display); font-weight: 800; font-size: 1.18rem;
          color: #08A3EA; min-width: 130px; }
        .hero-botones { display: flex; gap: 14px; flex-wrap: wrap; }
        .hero-checks { display: flex; gap: 22px; margin-top: 30px; flex-wrap: wrap; }
        .hero-checks li { display: flex; align-items: center; gap: 7px; color: var(--gris-700); font-size: 0.92rem; font-weight: 600; }
        .hero-checks svg { color: #08A3EA; }

        .hero-deco { position: relative; height: 400px; }
        .deco-card { position: absolute; background: rgba(255,255,255,0.80); border: 1px solid rgba(15,41,83,0.08);
          backdrop-filter: blur(10px); border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 12px;
          width: 196px; box-shadow: 0 18px 44px rgba(13,39,80,0.14); animation: flotar 5s ease-in-out infinite; }
        .deco-txt strong { display: block; font-weight: 800; font-size: 1.04rem; line-height: 1.2; color: var(--azul-900); }
        .deco-txt span { display: block; font-size: 0.78rem; color: var(--gris-500); margin-top: 2px; }
        .deco-ico { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 12px; color: #fff;
          box-shadow: 0 8px 18px rgba(13,39,80,0.18); }
        .deco-1 { top: 4px; left: 0; }
        .deco-2 { top: 70px; right: 6px; animation-delay: .6s; }
        .deco-3 { bottom: 64px; left: 30px; animation-delay: 1.2s; }
        .deco-4 { bottom: 0; right: 40px; animation-delay: 1.8s; }

        .hero-trust { max-width: 1280px; margin: 0 auto; padding: 0 32px 40px; }
        .trust-strip { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;
          background: rgba(255,255,255,0.72); border: 1px solid rgba(15,41,83,0.06); backdrop-filter: blur(10px);
          border-radius: var(--radio); padding: 20px 22px; box-shadow: var(--sombra); }
        .trust-item { display: flex; align-items: center; gap: 13px; }
        .trust-ico { flex-shrink: 0; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 11px;
          background: rgba(8,163,234,0.12); color: #08A3EA; }
        .trust-item strong { display: block; color: var(--azul-900); font-size: 0.95rem; font-weight: 700; }
        .trust-item span { color: var(--gris-500); font-size: 0.82rem; }

        .serv-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }
        .serv-card { padding: 30px 26px; display: flex; flex-direction: column; }
        .serv-icono { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 15px;
          background: var(--grad-marca); color: #fff; margin-bottom: 18px; box-shadow: 0 10px 22px rgba(34,131,228,0.25); }
        .serv-card h3 { font-size: 1.16rem; margin-bottom: 9px; }
        .serv-card p { color: var(--texto-suave); font-size: 0.93rem; flex: 1; }
        .serv-link { display: inline-flex; align-items: center; gap: 6px; margin-top: 16px; font-weight: 700;
          font-size: 0.88rem; color: var(--azul-700); }
        .serv-link svg { transition: transform var(--transicion); }
        .serv-card:hover .serv-link svg { transform: translateX(4px); }
        .serv-link:hover { color: var(--rojo); }

        .dest-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 22px; }

        .cta { position: relative; overflow: hidden; padding: 72px 0;
          background: linear-gradient(135deg, var(--azul-900), var(--azul-700)); }
        .cta-glow { position:absolute; width: 480px; height: 480px; border-radius:50%; filter: blur(90px);
          background: rgba(34,211,238,0.22); top: -200px; right: -60px; pointer-events:none; }
        .cta-inner { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 26px; flex-wrap: wrap; }

        @media (max-width: 980px) {
          .hero-inner { grid-template-columns: 1fr; padding-top: 64px; } .hero-deco { display: none; }
          .serv-grid { grid-template-columns: repeat(2,1fr); }
          .dest-grid { grid-template-columns: repeat(2,1fr); }
          .trust-strip { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .serv-grid, .dest-grid { grid-template-columns: 1fr; }
          .trust-strip { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
