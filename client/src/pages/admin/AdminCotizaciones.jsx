import { useEffect, useState, useMemo } from 'react';
import { api, abrirArchivoPrivado } from '../../services/api.js';
import { IconClose, IconWhatsApp } from '../../components/Icons.jsx';
import { dentroDeRango } from '../../utils/fechas.js';
import { linkWhatsApp } from '../../context/ContenidoContext.jsx';

function imprimirCotizacion(c) {
  const fecha = new Date(c.created_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>Cotización — ${c.cliente_nombre}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:13px;color:#1a1a2e;padding:36px 48px}
    .logo{font-size:22px;font-weight:900;color:#0f2953;letter-spacing:-0.5px}
    .logo span{color:#e05c1a}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #0f2953}
    .meta{text-align:right;font-size:12px;color:#555}
    .meta strong{display:block;font-size:18px;color:#0f2953;margin-bottom:4px}
    .section{margin-bottom:20px}
    .section h3{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#666;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;background:#f8f9fc;padding:12px 16px;border-radius:6px;font-size:12.5px}
    .grid2 .lbl{color:#666;font-size:11.5px}
    .box{background:#f8f9fc;padding:12px 16px;border-radius:6px;font-size:12.5px;line-height:1.7;white-space:pre-wrap}
    .badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#fef3e2;color:#c05c00}
    .footer{margin-top:32px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:11px;color:#999;text-align:center}
    @media print{body{padding:20px 28px} body > div:first-child{display:none!important}}
  </style></head><body>
  <div style="background:#f1f5f9;border-bottom:1px solid #cbd5e1;padding:8px 20px;font-size:12px;color:#334155;display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:10">
    <div><strong>Vista previa</strong> — Usa <kbd>Ctrl/Cmd + P</kbd> para imprimir o guardar como PDF</div>
    <button onclick="window.print()" style="background:#0f2953;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer">🖨️ Imprimir / PDF</button>
  </div>
  <div class="header">
    <div>
      <div class="logo">Señaliza<span>.</span></div>
      <div style="font-size:11px;color:#666;margin-top:4px">Señaliza S.A. · Soluciones Visuales</div>
    </div>
    <div class="meta">
      <strong>Solicitud de Cotización</strong>
      Fecha: ${fecha}<br>
      Estado: <span class="badge">${c.estado}</span>
    </div>
  </div>

  <div class="section">
    <h3>Datos del cliente</h3>
    <div class="grid2">
      <div><div class="lbl">Nombre</div>${c.cliente_nombre}</div>
      <div><div class="lbl">Teléfono</div>${c.telefono || '—'}</div>
      ${c.email ? `<div><div class="lbl">Correo</div>${c.email}</div>` : ''}
      ${c.empresa ? `<div><div class="lbl">Empresa</div>${c.empresa}</div>` : ''}
      <div><div class="lbl">Contacto preferido</div>${c.contacto_preferido || '—'}</div>
    </div>
  </div>

  ${c.producto_servicio ? `<div class="section"><h3>Producto / Servicio solicitado</h3><div class="box">${c.producto_servicio}</div></div>` : ''}
  ${c.descripcion ? `<div class="section"><h3>Descripción del proyecto</h3><div class="box">${c.descripcion}</div></div>` : ''}
  ${c.detalles ? `<div class="section"><h3>Medidas / Detalles adicionales</h3><div class="box">${c.detalles}</div></div>` : ''}

  <div class="footer">Documento generado por el sistema Señaliza S.A. · ${new Date().toLocaleDateString('es-CR')}</div>

  <script>
    // Vista de previsualización (no imprime automáticamente)
    // Usa Ctrl/Cmd + P o el botón del navegador para imprimir o "Guardar como PDF".
  <\/script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=820,height=1000');
  w.document.write(html);
  w.document.close();
}

const ESTADOS = ['pendiente', 'revisada', 'completada'];
const BADGE = { pendiente: 'badge-amarillo', revisada: 'badge-azul', completada: 'badge-verde' };

export default function AdminCotizaciones() {
  const [cots, setCots] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sel, setSel] = useState(null);

  // Filtros
  const [buscar, setBuscar] = useState('');
  const [fEstado, setFEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  async function cargar() {
    setCargando(true);
    try { setCots(await api.adminCotizaciones()); } catch (e) { console.error(e); }
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return cots.filter((c) => {
      if (q && !(`${c.cliente_nombre} ${c.empresa || ''} ${c.email || ''} ${c.telefono || ''} ${c.producto_servicio || ''}`.toLowerCase().includes(q))) return false;
      if (fEstado && c.estado !== fEstado) return false;
      if (!dentroDeRango(c.created_at, desde, hasta)) return false;
      return true;
    });
  }, [cots, buscar, fEstado, desde, hasta]);

  const hayFiltros = buscar || fEstado || desde || hasta;
  function limpiar() { setBuscar(''); setFEstado(''); setDesde(''); setHasta(''); }

  async function cambiar(id, estado) {
    try {
      await api.estadoCotizacion(id, { estado });
      setCots((arr) => arr.map((c) => (c.id === id ? { ...c, estado } : c)));
      if (sel?.id === id) setSel({ ...sel, estado });
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="panel">
      <div className="panel-head"><h2>Cotizaciones ({cots.length})</h2></div>

      <div className="adm-filtros">
        <div className="adm-f adm-f-buscar">
          <label>Buscar</label>
          <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Cliente, empresa, contacto o producto…" />
        </div>
        <div className="adm-f">
          <label>Estado</label>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="adm-f">
          <label>Desde</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>
        <div className="adm-f">
          <label>Hasta</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>
        {hayFiltros && <button className="adm-f-limpiar" onClick={limpiar}>Limpiar</button>}
        <span className="adm-f-conteo">{filtrados.length} de {cots.length}</span>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {cargando ? <div className="vacio">Cargando…</div>
          : cots.length === 0 ? <div className="vacio">Aún no hay solicitudes de cotización.</div>
            : filtrados.length === 0 ? <div className="vacio">Ninguna cotización coincide con los filtros.</div>
            : (
              <table className="tabla">
                <thead>
                  <tr><th>Cliente</th><th>Producto / servicio</th><th>Contacto</th><th>Estado</th><th>Fecha</th><th></th></tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.cliente_nombre}</strong>{c.empresa && <span><br /><span className="muted">{c.empresa}</span></span>}</td>
                      <td>{c.producto_servicio || '—'}</td>
                      <td>{c.telefono || '—'}{c.email && <span><br /><span className="muted">{c.email}</span></span>}</td>
                      <td><span className={`badge ${BADGE[c.estado]}`}>{c.estado}</span></td>
                      <td className="muted">{new Date(c.created_at).toLocaleDateString('es-CR')}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', alignItems: 'center' }}>
                          <button className="btn btn-fantasma btn-sm" onClick={() => setSel(c)}>Ver</button>
                          {c.telefono && (
                            <a
                              href={linkWhatsApp(c.telefono, 'Hola ' + ((c.cliente_nombre || '').split(' ')[0] || '') + ', te contacto sobre tu solicitud de cotización' + (c.producto_servicio ? ' para "' + c.producto_servicio + '"' : '') + '.')}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-fantasma btn-sm"
                              title="WhatsApp"
                              style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center' }}
                            >
                              <IconWhatsApp size={15} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </div>

      {sel && (
        <div className="modal-fondo" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Cotización de {sel.cliente_nombre}</h3>
              <button onClick={() => setSel(null)}><IconClose /></button>
            </div>
            <div className="modal-body" style={{ lineHeight: 1.8 }}>
              <p>
                <strong>Teléfono:</strong> {sel.telefono}
                {sel.telefono && (
                  <a
                    href={linkWhatsApp(sel.telefono, 'Hola ' + (sel.cliente_nombre || '').split(' ')[0] + ', te contacto sobre tu solicitud de cotización' + (sel.producto_servicio ? ' para "' + sel.producto_servicio + '"' : '') + '.')}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 8, color: '#25D366', display: 'inline-flex', verticalAlign: 'middle' }}
                    title="Contactar por WhatsApp"
                  >
                    <IconWhatsApp size={17} />
                  </a>
                )}
              </p>
              {sel.email && <p><strong>Correo:</strong> {sel.email}</p>}
              {sel.empresa && <p><strong>Empresa:</strong> {sel.empresa}</p>}
              {sel.producto_servicio && <p><strong>Producto / servicio:</strong> {sel.producto_servicio}</p>}
              <p><strong>Contacto preferido:</strong> {sel.contacto_preferido}</p>
              {sel.descripcion && <p style={{ marginTop: 8 }}><strong>Descripción:</strong><br />{sel.descripcion}</p>}
              {sel.detalles && <p style={{ marginTop: 8 }}><strong>Medidas / detalles:</strong><br />{sel.detalles}</p>}
              {sel.archivo && (
                <p style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    className="btn btn-fantasma btn-sm"
                    onClick={() => abrirArchivoPrivado(`/admin/cotizaciones/${sel.id}/archivo`).catch((e) => alert(e.message))}
                  >
                    Ver archivo adjunto
                  </button>
                </p>
              )}
              <div style={{ marginTop: 18 }}>
                <label className="lbl">Estado</label>
                <select className="campo" value={sel.estado} onChange={(e) => cambiar(sel.id, e.target.value)}>
                  {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-fantasma" onClick={() => setSel(null)}>Cerrar</button>
              {sel.telefono && (
                <a
                  className="btn btn-fantasma btn-sm"
                  href={linkWhatsApp(sel.telefono, `Hola ${sel.cliente_nombre}, te contacto sobre tu solicitud de cotización${sel.producto_servicio ? ` para "${sel.producto_servicio}"` : ''}.`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <IconWhatsApp size={16} /> WhatsApp
                </a>
              )}
              <button className="btn btn-fantasma btn-sm" onClick={() => imprimirCotizacion(sel)}>
                👁 Previsualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
