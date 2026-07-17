import { useEffect, useState } from 'react';
import { api } from '../../services/api.js';
import { IconCheck } from '../../components/Icons.jsx';

const TEXTOS = [
  { clave: 'hero_titulo', label: 'Título principal (inicio)', area: false },
  { clave: 'hero_subtitulo', label: 'Subtítulo del inicio', area: true },
  { clave: 'mision', label: 'Misión', area: true },
  { clave: 'vision', label: 'Visión', area: true },
  { clave: 'mensaje_destacado', label: 'Mensaje destacado', area: true },
];
const CONTACTO = [
  { clave: 'telefono', label: 'Teléfono' },
  { clave: 'whatsapp', label: 'WhatsApp (solo dígitos, ej. 50688888888)' },
  { clave: 'email', label: 'Correo electrónico' },
  { clave: 'direccion', label: 'Dirección' },
  { clave: 'sinpe_numero', label: 'Número SINPE Móvil' },
  { clave: 'sinpe_nombre', label: 'Nombre titular SINPE' },
  { clave: 'transferencia_iban', label: 'IBAN para transferencias bancarias' },
  { clave: 'transferencia_nombre', label: 'Nombre titular cuenta (transferencia)' },
];

export default function AdminContenido() {
  const [textos, setTextos] = useState({});
  const [contacto, setContacto] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.contenido();
        setTextos(data.textos || {});
        setContacto(data.contacto || {});
      } catch (e) { console.error(e); }
      setCargando(false);
    })();
  }, []);

  async function guardar() {
    setGuardando(true); setOk(false);
    try {
      await api.guardarContenido({ textos, contacto });
      setOk(true);
      setTimeout(() => setOk(false), 2500);
    } catch (e) { alert(e.message); }
    setGuardando(false);
  }

  if (cargando) return <div className="panel"><div className="vacio">Cargando…</div></div>;

  return (
    <>
      <div className="panel">
        <div className="panel-head"><h2>Textos del sitio</h2></div>
        <div className="panel-body">
          {TEXTOS.map((t) => (
            <div key={t.clave} style={{ marginBottom: 16 }}>
              <label className="lbl">{t.label}</label>
              {t.area
                ? <textarea className="campo" rows={2} value={textos[t.clave] || ''}
                    onChange={(e) => setTextos({ ...textos, [t.clave]: e.target.value })} />
                : <input className="campo" value={textos[t.clave] || ''}
                    onChange={(e) => setTextos({ ...textos, [t.clave]: e.target.value })} />}
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head"><h2>Información de contacto</h2></div>
        <div className="panel-body">
          <div className="campo-row">
            {CONTACTO.map((c) => (
              <div key={c.clave} style={{ marginBottom: 16 }}>
                <label className="lbl">{c.label}</label>
                <input className="campo" value={contacto[c.clave] || ''}
                  onChange={(e) => setContacto({ ...contacto, [c.clave]: e.target.value })} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fila" style={{ justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
        {ok && <span className="badge badge-verde"><IconCheck /> Cambios guardados</span>}
        <button className="btn btn-primario" onClick={guardar} disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </>
  );
}
