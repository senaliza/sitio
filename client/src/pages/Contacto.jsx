import { useState } from 'react';
import { api } from '../services/api.js';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import Reveal from '../components/Reveal.jsx';
import CountUp from '../components/CountUp.jsx';
import TextoRotativo from '../components/TextoRotativo.jsx';
import { IconPhone, IconMail, IconPin, IconWhatsApp, IconCheck, IconArrow } from '../components/Icons.jsx';

const inicial = { nombre: '', email: '', telefono: '', asunto: '', mensaje: '' };

export default function Contacto() {
  const { contacto } = useContenido();
  const [form, setForm] = useState(inicial);
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.email || !form.mensaje) {
      setError('Nombre, correo y mensaje son obligatorios.');
      return;
    }
    setEnviando(true);
    try {
      await api.enviarContacto(form);
      setOk(true);
      setForm(inicial);
    } catch (err) {
      setError(err.message || 'No se pudo enviar el mensaje.');
    } finally {
      setEnviando(false);
    }
  };

  const metodos = [
    { Icono: IconPhone, titulo: 'Teléfono', valor: contacto.telefono, href: `tel:${contacto.telefono}` },
    { Icono: IconMail, titulo: 'Correo', valor: contacto.email, href: `mailto:${contacto.email}` },
    { Icono: IconWhatsApp, titulo: 'WhatsApp', valor: 'Escríbanos', href: linkWhatsApp(contacto.whatsapp, 'Hola, quisiera más información.') },
    { Icono: IconPin, titulo: 'Ubicación', valor: contacto.direccion, href: null },
  ];

  return (
    <>
      <section className="page-head">
        <div className="contenedor">
          <h1 className="seccion-titulo">Hablemos de su proyecto</h1>
          <p style={{ maxWidth: 560 }}>Estamos para ayudarle. Contáctenos por el medio que prefiera.</p>
          <div className="cont-rot">
            Le atendemos por{' '}
            <TextoRotativo className="cont-rot-word" palabras={['WhatsApp', 'correo', 'teléfono']} />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor cont-layout">
          {/* Formulario */}
          <Reveal as="div" className="card cont-form">
            {ok ? (
              <div className="cont-ok">
                <span className="cont-ok-ico"><IconCheck size={38} /></span>
                <h3>¡Mensaje enviado!</h3>
                <p className="muted">Gracias por escribirnos. Le responderemos lo antes posible.</p>
                <button className="btn btn-fantasma" onClick={() => setOk(false)}>Enviar otro mensaje</button>
              </div>
            ) : (
              <form onSubmit={enviar} noValidate>
                <h2 className="cont-form-titulo">Envíenos un mensaje</h2>
                <p className="muted" style={{ marginBottom: 22 }}>Complete el formulario y le contactaremos pronto.</p>

                {error && <div className="alerta alerta-error">{error}</div>}

                <div className="grid-2">
                  <div className="campo"><label>Nombre completo *</label><input value={form.nombre} onChange={set('nombre')} placeholder="Su nombre" /></div>
                  <div className="campo"><label>Correo electrónico *</label><input type="email" value={form.email} onChange={set('email')} placeholder="correo@ejemplo.com" /></div>
                  <div className="campo"><label>Teléfono</label><input value={form.telefono} onChange={set('telefono')} placeholder="Opcional" /></div>
                  <div className="campo"><label>Asunto</label><input value={form.asunto} onChange={set('asunto')} placeholder="¿Sobre qué nos escribe?" /></div>
                </div>
                <div className="campo"><label>Mensaje *</label><textarea value={form.mensaje} onChange={set('mensaje')} placeholder="Cuéntenos cómo podemos ayudarle..." style={{ minHeight: 140 }} /></div>

                <button className="btn btn-primario btn-bloque" disabled={enviando} type="submit" style={{ marginTop: 6 }}>
                  {enviando ? 'Enviando...' : <>Enviar mensaje <IconArrow size={18} /></>}
                </button>
              </form>
            )}
          </Reveal>

          {/* Métodos de contacto */}
          <aside className="cont-aside">
            {metodos.map(({ Icono, titulo, valor, href }, i) => {
              const Inner = (
                <div className="cont-metodo card">
                  <span className="cont-icono"><Icono size={22} /></span>
                  <div>
                    <strong>{titulo}</strong>
                    <span className="muted">{valor}</span>
                  </div>
                </div>
              );
              return (
                <Reveal as="div" key={titulo} delay={i * 70}>
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{Inner}</a>
                    : Inner}
                </Reveal>
              );
            })}
          </aside>
        </div>

        <div className="contenedor">
          <Reveal as="div" className="metricas-claro cont-metricas">
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={24} prefijo="< " sufijo=" h" /></div>
              <div className="metrica-lbl">Tiempo de respuesta</div>
            </div>
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={3} /></div>
              <div className="metrica-lbl">Canales de atención</div>
            </div>
            <div className="metrica">
              <div className="metrica-num"><CountUp fin={100} sufijo="%" /></div>
              <div className="metrica-lbl">Atención personalizada</div>
            </div>
          </Reveal>
        </div>
      </section>

      <style>{`
        .cont-rot { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; margin-top: 16px;
          color: var(--texto-suave); font-weight: 600; }
        .cont-rot-word { font-family: var(--fuente-display); font-weight: 800; font-size: 1.1rem; color: var(--azul-700); min-width: 96px; }

        .cont-layout { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 26px; align-items: start; }
        .cont-form { padding: 34px; }
        .cont-form-titulo { font-size: 1.5rem; margin-bottom: 4px; }

        .cont-ok { text-align: center; padding: 24px 8px; }
        .cont-ok-ico { display: inline-grid; place-items: center; width: 80px; height: 80px; border-radius: 50%;
          background: #dcfce7; color: #15803d; margin-bottom: 18px; }
        .cont-ok h3 { font-size: 1.4rem; margin-bottom: 8px; }
        .cont-ok p { max-width: 360px; margin: 0 auto 20px; }

        .cont-aside { display: flex; flex-direction: column; gap: 14px; }
        .cont-aside a { display: block; }
        .cont-metodo { display: flex; align-items: center; gap: 14px; padding: 18px 20px; }
        .cont-metodo strong { display: block; color: var(--azul-900); font-size: 0.98rem; }
        .cont-metodo .muted { font-size: 0.9rem; }
        .cont-icono { flex-shrink: 0; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 13px;
          background: var(--grad-marca); color: #fff; box-shadow: 0 10px 22px rgba(34,131,228,0.22); }

        .cont-metricas { grid-template-columns: repeat(3, 1fr); margin-top: 44px; }
        @media (max-width: 920px) { .cont-layout { grid-template-columns: 1fr; } }
        @media (max-width: 760px) {
          .cont-metricas { grid-template-columns: 1fr; gap: 22px; }
          .cont-metricas .metrica { border-left: 0; border-top: 0; padding-top: 0; }
        }
      `}</style>
    </>
  );
}
