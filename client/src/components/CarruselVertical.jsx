import { useEffect, useState } from 'react';
import { IconArrow } from './Icons.jsx';
import {
  IlustracionRotulos, IlustracionSenales, IlustracionViniles, IlustracionAcrilicos, IlustracionPublicidad,
  IlustracionRotulos2, IlustracionSenales2, IlustracionViniles2, IlustracionAcrilicos2, IlustracionPublicidad2,
} from './IlustracionesProducto.jsx';

// Carrusel vertical premium: las diapositivas se deslizan en vertical con
// autoplay, indicadores laterales con barra de progreso y control manual.
// Pensado para mostrar las líneas de producto de la marca debajo del hero.
//
// FOTOS por categoría: suelte las imágenes en
//   src/assets/carrusel/<categoria>/  (ver LEEME.md)
// Se toman automáticamente aquí abajo. Si una categoría tiene varias
// imágenes, la diapositiva las rota con cross-fade; si está vacía, se
// muestra la ilustración vectorial de la marca como respaldo.
const MODULOS = import.meta.glob(
  '../assets/carrusel/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

const IMAGENES = {};
for (const ruta in MODULOS) {
  const m = ruta.match(/carrusel\/([^/]+)\//);
  if (!m) continue;
  (IMAGENES[m[1]] ||= []).push({ ruta, url: MODULOS[ruta] });
}
// Orden estable y alfabético por nombre de archivo.
const imgsDe = (cat) =>
  (IMAGENES[cat] || []).sort((a, b) => a.ruta.localeCompare(b.ruta)).map((x) => x.url);

const SLIDES = [
  {
    cat: 'rotulos', ilus: [IlustracionRotulos, IlustracionRotulos2], etq: 'Rótulos y letreros',
    titulo: 'Rótulos luminosos y letras corpóreas',
    texto: 'Fachadas que destacan su negocio de día y de noche, con materiales duraderos y acabados profesionales.',
    grad: 'linear-gradient(135deg, #0A246E 0%, #094C9F 60%, #08A3EA 100%)',
  },
  {
    cat: 'senalizacion', ilus: [IlustracionSenales, IlustracionSenales2], etq: 'Señalización',
    titulo: 'Señalización vial y de seguridad',
    texto: 'Señales informativas, de seguridad y viales conforme a la normativa vigente para empresas e instituciones.',
    grad: 'linear-gradient(135deg, #094C9F 0%, #08A3EA 70%, #60BB4D 100%)',
  },
  {
    cat: 'adhesivos', ilus: [IlustracionViniles, IlustracionViniles2], etq: 'Adhesivos y rotulación vehicular',
    titulo: 'Adhesivos y rotulación de vehículos',
    texto: 'Adhesivos de corte e impresos, decoración de vitrinas y rotulación de flotillas para llevar su marca a la calle.',
    grad: 'linear-gradient(135deg, #08A3EA 0%, #1d8fbf 55%, #094C9F 100%)',
  },
  {
    cat: 'acrilicos', ilus: [IlustracionAcrilicos, IlustracionAcrilicos2], etq: 'Acrílicos',
    titulo: 'Letras corpóreas y acabados en acrílico',
    texto: 'Piezas laser-cut en acrílico transparente y de color, ideales para letreros corpóreos, displays y acabados premium.',
    grad: 'linear-gradient(135deg, #094C9F 0%, #143868 55%, #0A246E 100%)',
  },
  {
    cat: 'publicidad', ilus: [IlustracionPublicidad, IlustracionPublicidad2], etq: 'Publicidad a la medida',
    titulo: 'Vallas, banners y proyectos especiales',
    texto: 'Soluciones visuales personalizadas, diseñadas a la medida de su proyecto y de la identidad de su marca.',
    grad: 'linear-gradient(135deg, #0A246E 0%, #143868 55%, #094C9F 100%)',
  },
].map((s) => ({ ...s, imgs: imgsDe(s.cat) }));

const DURACION = 5000; // ms por diapositiva
const DURACION_IMG = 2600; // ms por imagen dentro de una diapositiva

// Rota entre las medias de una categoría con cross-fade. Prioriza las FOTOS
// reales de la carpeta; si no hay, rota entre las ilustraciones de marca.
function SlideMedia({ imgs, ilus, titulo, activa, pausado, reducido }) {
  const [idx, setIdx] = useState(0);
  const usarFotos = imgs.length > 0;
  const total = usarFotos ? imgs.length : ilus.length;
  const multi = total > 1;

  useEffect(() => {
    if (!activa || !multi || pausado || reducido) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), DURACION_IMG);
    return () => clearInterval(t);
  }, [activa, multi, pausado, reducido, total]);

  useEffect(() => { if (!activa) setIdx(0); }, [activa]);

  return (
    <div className="vsl-gal">
      {usarFotos
        ? imgs.map((src, i) => (
            <img
              key={src}
              className={`vsl-media ${i === idx ? 'on' : ''}`}
              src={src}
              alt={titulo}
              loading="lazy"
            />
          ))
        : ilus.map((Ilus, i) => (
            <div key={i} className={`vsl-media vsl-ilus ${i === idx ? 'on' : ''}`} aria-hidden>
              <Ilus />
            </div>
          ))}
      {multi && (
        <div className="vsl-gal-dots" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={i === idx ? 'on' : ''} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CarruselVertical() {
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [reducido, setReducido] = useState(false);
  const n = SLIDES.length;

  useEffect(() => {
    setReducido(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (pausado || reducido) return;
    const t = setTimeout(() => setActivo((i) => (i + 1) % n), DURACION);
    return () => clearTimeout(t);
  }, [activo, pausado, reducido, n]);

  const ir = (i) => setActivo((i + n) % n);
  const s = SLIDES[activo];

  return (
    <section
      className="vsl"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="contenedor vsl-inner">
        {/* Columna de texto (cambia con cada slide) */}
        <div className="vsl-txt">
          <div className="vsl-num">
            <strong>{String(activo + 1).padStart(2, '0')}</strong>
            <span>/ {String(n).padStart(2, '0')}</span>
          </div>
          <div key={activo} className="vsl-anim">
            <span className="vsl-etq">{s.etq}</span>
            <h2 className="vsl-titulo">{s.titulo}</h2>
            <p className="vsl-desc">{s.texto}</p>
          </div>
          <div className="vsl-ctrl">
            <button className="vsl-btn" onClick={() => ir(activo - 1)} aria-label="Anterior">
              <IconArrow size={18} style={{ transform: 'rotate(-90deg)' }} />
            </button>
            <button className="vsl-btn" onClick={() => ir(activo + 1)} aria-label="Siguiente">
              <IconArrow size={18} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </div>
        </div>

        {/* Escenario con desplazamiento vertical */}
        <div className="vsl-stage">
          <div
            className="vsl-track"
            style={{ transform: `translate3d(0, ${-activo * 100}%, 0)` }}
          >
            {SLIDES.map((sl, i) => (
              <div className="vsl-slide" key={i} style={{ background: sl.grad }}>
                <span className="vsl-grid" aria-hidden />
                <SlideMedia
                  imgs={sl.imgs}
                  ilus={sl.ilus}
                  titulo={sl.titulo}
                  activa={i === activo}
                  pausado={pausado}
                  reducido={reducido}
                />
                <span className="vsl-orbe" aria-hidden />
                <div className="vsl-cap">
                  <span>{sl.etq}</span>
                  <strong>{sl.titulo}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Indicadores verticales con progreso */}
          <div className="vsl-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`vsl-dot ${i === activo ? 'on' : ''}`}
                onClick={() => ir(i)}
                aria-label={`Ir a la diapositiva ${i + 1}`}
              >
                <span
                  className="vsl-dot-fill"
                  style={{ animationDuration: `${DURACION}ms`, animationPlayState: pausado || reducido ? 'paused' : 'running' }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .vsl { padding: 80px 0; position: relative; background: rgba(255,255,255,0.34); backdrop-filter: blur(2px); }
        .vsl-inner { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 48px; align-items: center; }

        .vsl-txt { position: relative; }
        .vsl-num { display: flex; align-items: baseline; gap: 8px; margin: 10px 0 18px; }
        .vsl-num strong { font-family: var(--fuente-display); font-size: 3.2rem; line-height: 1;
          background: linear-gradient(135deg, #094C9F, #08A3EA); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent; }
        .vsl-num span { color: var(--gris-500); font-weight: 700; font-size: 1.1rem; }
        .vsl-etq { display: inline-block; font-size: 0.8rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: #08A3EA; margin-bottom: 10px; }
        .vsl-titulo { font-size: clamp(1.5rem, 2.6vw, 2.1rem); line-height: 1.15; margin-bottom: 12px; color: var(--azul-900); }
        .vsl-desc { color: var(--texto-suave); font-size: 1.02rem; max-width: 440px; }
        .vsl-anim { animation: vsl-in 0.6s cubic-bezier(0.22,1,0.36,1); }
        @keyframes vsl-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

        .vsl-ctrl { display: flex; gap: 12px; margin-top: 28px; }
        .vsl-btn { width: 50px; height: 50px; border-radius: 50%; border: 1.5px solid var(--gris-200);
          background: #fff; color: var(--azul-700); display: grid; place-items: center; cursor: pointer;
          transition: transform var(--transicion), border-color var(--transicion), color var(--transicion), box-shadow var(--transicion); }
        .vsl-btn:hover { border-color: #08A3EA; color: #08A3EA; transform: translateY(-2px); box-shadow: var(--sombra-azul); }

        .vsl-stage { position: relative; height: 460px; border-radius: var(--radio-lg);
          overflow: hidden; box-shadow: var(--sombra-md); }
        .vsl-track { height: 100%; transition: transform 0.85s cubic-bezier(0.76, 0, 0.24, 1); }
        .vsl-slide { position: relative; height: 100%; display: flex; align-items: center; justify-content: center;
          color: #fff; overflow: hidden; }
        .vsl-grid { position: absolute; inset: 0; opacity: 0.14; z-index: 0;
          background-image: radial-gradient(circle at 1px 1px, #fff 1px, transparent 0); background-size: 26px 26px; }
        .vsl-gal { position: absolute; inset: 0; z-index: 1; }
        .vsl-media { position: absolute; inset: 0; width: 100%; height: 100%;
          opacity: 0; transition: opacity 0.8s ease; }
        .vsl-media.on { opacity: 1; }
        img.vsl-media { object-fit: cover; }
        .vsl-ilus .ilus { width: 100%; height: 100%; display: block;
          filter: drop-shadow(0 14px 30px rgba(0,0,0,0.22)); }
        .vsl-gal-dots { position: absolute; top: 18px; left: 20px; z-index: 2; display: flex; gap: 7px; }
        .vsl-gal-dots span { width: 22px; height: 4px; border-radius: 99px; background: rgba(255,255,255,0.4);
          transition: background var(--transicion), width var(--transicion); }
        .vsl-gal-dots span.on { background: #fff; width: 30px; }
        .vsl-orbe { position: absolute; width: 320px; height: 320px; border-radius: 50%; z-index: 0;
          background: rgba(255,255,255,0.12); top: -120px; right: -100px; filter: blur(10px); }
        .vsl-cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 28px 32px; z-index: 1;
          background: linear-gradient(to top, rgba(7,18,45,0.78), transparent); }
        .vsl-cap span { display: block; font-size: 0.74rem; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: rgba(255,255,255,0.85); margin-bottom: 4px; }
        .vsl-cap strong { font-family: var(--fuente-display); font-size: 1.2rem; }

        .vsl-dots { position: absolute; top: 50%; right: 22px; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 12px; z-index: 2; }
        .vsl-dot { width: 6px; height: 42px; border-radius: 99px; border: none; cursor: pointer; padding: 0;
          background: rgba(255,255,255,0.35); overflow: hidden; transition: background var(--transicion); }
        .vsl-dot.on { background: rgba(255,255,255,0.3); }
        .vsl-dot-fill { display: block; width: 100%; height: 0; background: #fff; }
        .vsl-dot.on .vsl-dot-fill { animation: vsl-fill linear forwards; }
        @keyframes vsl-fill { from { height: 0; } to { height: 100%; } }

        @media (max-width: 880px) {
          .vsl-inner { grid-template-columns: 1fr; gap: 28px; }
          .vsl-stage { height: 360px; }
          .vsl-num strong { font-size: 2.6rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsl-track { transition: none; }
          .vsl-anim { animation: none; }
          .vsl-dot.on .vsl-dot-fill { animation: none; height: 100%; }
        }
      `}</style>
    </section>
  );
}
