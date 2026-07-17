import { useState } from 'react';
import { api } from '../services/api.js';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import { IconUpload, IconCheck, IconWhatsApp } from '../components/Icons.jsx';

const inicial = {
  cliente_nombre: '', telefono: '', email: '', empresa: '',
  producto_servicio: '', descripcion: '', detalles: '', contacto_preferido: 'whatsapp',
};

export default function Cotizar() {
  const { contacto } = useContenido();
  const [form, setForm] = useState(inicial);
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const enviar = async () => {
    setError('');
    if (!form.cliente_nombre || !form.telefono) { setError('Nombre y teléfono son obligatorios.'); return; }
    setEnviando(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (archivo) fd.append('archivo', archivo);
      await api.crearCotizacion(fd);
      setOk(true);
      setForm(inicial); setArchivo(null);
    } catch (e) {
      setError(e.message || 'No se pudo enviar la cotización.');
    } finally {
      setEnviando(false);
    }
  };

  if (ok) {
    return (
      <section className="seccion"><div className="contenedor centro" style={{ padding: '30px 0' }}>
        <span style={{ display: 'inline-grid', placeItems: 'center', width: 84, height: 84, borderRadius: '50%', background: '#dcfce7', color: '#15803d', marginBottom: 20 }}><IconCheck size={42} /></span>
        <h1 style={{ marginBottom: 10 }}>¡Solicitud enviada!</h1>
        <p className="muted" style={{ maxWidth: 440, margin: '0 auto 22px' }}>Recibimos su solicitud de cotización. Nuestro equipo la revisará y le contactará pronto.</p>
        <button className="btn btn-fantasma" onClick={() => setOk(false)}>Enviar otra solicitud</button>
      </div></section>
    );
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <h1 className="seccion-titulo">Solicite su cotización</h1>
        <p className="seccion-intro">Cuéntenos sobre su proyecto y le enviaremos una propuesta a la medida.</p>

        <div className="cot-grid">
          <div className="card cot-form">
            {error && <div className="alerta alerta-error">{error}</div>}
            <div className="grid-2">
              <div className="campo"><label>Nombre completo *</label><input value={form.cliente_nombre} onChange={set('cliente_nombre')} /></div>
              <div className="campo"><label>Teléfono *</label><input value={form.telefono} onChange={set('telefono')} /></div>
              <div className="campo"><label>Correo electrónico</label><input type="email" value={form.email} onChange={set('email')} /></div>
              <div className="campo"><label>Empresa</label><input value={form.empresa} onChange={set('empresa')} /></div>
            </div>
            <div className="campo"><label>Producto o servicio requerido</label><input value={form.producto_servicio} onChange={set('producto_servicio')} placeholder="Ej. Rótulo luminoso, adhesivo impreso..." /></div>
            <div className="campo"><label>Descripción del proyecto</label><textarea value={form.descripcion} onChange={set('descripcion')} /></div>
            <div className="campo"><label>Medidas, cantidades o detalles importantes</label><textarea value={form.detalles} onChange={set('detalles')} /></div>
            <div className="grid-2">
              <div className="campo">
                <label>Método de contacto preferido</label>
                <select value={form.contacto_preferido} onChange={set('contacto_preferido')}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="correo">Correo electrónico</option>
                  <option value="telefono">Teléfono</option>
                </select>
              </div>
              <div className="campo">
                <label>Archivo o imagen de referencia</label>
                <label className="upload">
                  <IconUpload size={20} />
                  <span>{archivo ? archivo.name : 'Adjuntar archivo'}</span>
                  <input type="file" accept="image/*,.pdf" hidden onChange={(e) => setArchivo(e.target.files[0])} />
                </label>
              </div>
            </div>
            <button className="btn btn-rojo btn-bloque" disabled={enviando} onClick={enviar} style={{ marginTop: 8 }}>
              {enviando ? 'Enviando...' : 'Enviar solicitud de cotización'}
            </button>
          </div>

          <aside className="cot-aside">
            <div className="card cot-info">
              <h3>¿Prefiere escribirnos?</h3>
              <p className="muted">También puede enviarnos su consulta directamente por WhatsApp y le atendemos de inmediato.</p>
              <a className="btn btn-wsp btn-bloque" href={linkWhatsApp(contacto.whatsapp, 'Hola, quisiera solicitar una cotización.')} target="_blank" rel="noreferrer" style={{ marginTop: 16 }}>
                <IconWhatsApp size={18} /> Cotizar por WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .cot-grid { display: grid; grid-template-columns: 1fr 330px; gap: 26px; align-items: start; }
        .cot-form { padding: 32px; }
        .upload { display: flex; align-items: center; gap: 10px; padding: 13px 15px; border: 1.5px dashed var(--gris-300);
          border-radius: var(--radio-sm); cursor: pointer; color: var(--gris-600); font-size: 0.9rem; background: var(--gris-50);
          transition: border var(--transicion), color var(--transicion), background var(--transicion); }
        .upload:hover { border-color: var(--azul-600); color: var(--azul-700); background: var(--azul-50); }
        .cot-aside { position: sticky; top: 96px; }
        .cot-info { padding: 28px; background: linear-gradient(160deg, var(--azul-50), #fff); border: 1px solid rgba(34,131,228,0.12); }
        .cot-info h3 { margin-bottom: 10px; }
        @media (max-width: 860px) { .cot-grid { grid-template-columns: 1fr; } .cot-aside { position: static; } }
      `}</style>
    </section>
  );
}
