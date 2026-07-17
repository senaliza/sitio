import { useContenido } from '../context/ContenidoContext.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import { IconStar, IconShield, IconCheck, IconLayers } from '../components/Icons.jsx';

export default function Nosotros() {
  const { textos } = useContenido();

  return (
    <>
      <section className="page-head">
        <div className="contenedor nos-head">
          <div className="nos-head-txt">
            <h1 className="seccion-titulo">Quiénes somos</h1>
            <p style={{ fontSize: '1.05rem' }}>
              {textos.mensaje_destacado}
            </p>
          </div>
          <Reveal as="figure" className="nos-head-foto">
            <img src="/fotos/stand-feria.jpg" alt="Presentación del plan de negocios de Señaliza S.A. en la Universidad de Costa Rica" loading="lazy" />
          </Reveal>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor nos-grid">
          <Reveal as="div" className="nos-bloque card">
            <span className="nos-icono" style={{ background: 'var(--azul-100)', color: 'var(--azul-700)' }}><IconStar size={24} /></span>
            <h3>Misión</h3>
            <p>{textos.mision}</p>
          </Reveal>
          <Reveal as="div" className="nos-bloque card" delay={120}>
            <span className="nos-icono" style={{ background: '#fde8ea', color: 'var(--rojo)' }}><IconShield size={24} /></span>
            <h3>Visión</h3>
            <p>{textos.vision}</p>
          </Reveal>
        </div>

        <div className="contenedor" style={{ marginTop: 56 }}>
          <h2 className="seccion-titulo">Calidad y enfoque en el cliente</h2>
          <div className="comp-grid">
            {[
              ['Experiencia', 'Conocimiento aplicado en cada proyecto de señalización y rotulación.'],
              ['Calidad', 'Materiales y procesos seleccionados para garantizar durabilidad.'],
              ['Atención', 'Acompañamiento cercano desde la idea hasta la instalación.'],
              ['Confianza', 'Cumplimiento y comunicación clara en todo momento.'],
            ].map(([t, d], i) => (
              <Reveal as="div" className="comp-item" key={t} delay={i * 80}>
                <span className="comp-check"><IconCheck size={16} /></span>
                <div><strong>{t}</strong><p className="muted">{d}</p></div>
              </Reveal>
            ))}
          </div>

          <Reveal as="div" className="metricas-claro" style={{ marginTop: 56 }}>
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

      <style>{`
        .nos-head { display: grid; grid-template-columns: 1fr 0.9fr; gap: 40px; align-items: center; }
        .nos-head-txt { max-width: 640px; }
        .nos-head-foto { margin: 0; border-radius: var(--radio-lg); overflow: hidden; box-shadow: var(--sombra-md); }
        .nos-head-foto img { display: block; width: 100%; height: 100%; max-height: 360px; object-fit: cover; }
        @media (max-width: 900px) { .nos-head { grid-template-columns: 1fr; gap: 28px; } }
        .nos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .nos-bloque { padding: 34px; }
        .nos-icono { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 15px; margin-bottom: 18px; }
        .nos-bloque h3 { font-size: 1.3rem; margin-bottom: 10px; }
        .nos-bloque p { color: var(--texto-suave); }
        .comp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 32px; }
        .comp-item { display: flex; gap: 14px; }
        .comp-check { flex-shrink: 0; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%;
          background: var(--grad-marca); color: #fff; box-shadow: 0 6px 14px rgba(34,131,228,0.28); }
        .comp-item strong { color: var(--azul-900); }
        @media (max-width: 768px) { .nos-grid, .comp-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
