import { useEffect, useState, useMemo } from 'react';
import { api, formatearPrecio, abrirArchivoPrivado } from '../../services/api.js';
import { IconClose, IconCheck, IconCard, IconWhatsApp } from '../../components/Icons.jsx';
import { dentroDeRango } from '../../utils/fechas.js';
import { linkWhatsApp } from '../../context/ContenidoContext.jsx';

function imprimirPedido(det) {
  const fecha = new Date(det.created_at).toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' });
  const filas = (det.detalle || []).map((d) => `
    <tr>
      <td>${d.producto_nombre}</td>
      <td style="text-align:center">${d.cantidad}</td>
      <td style="text-align:right">${formatearPrecio(d.precio_unitario)}</td>
      <td style="text-align:right"><strong>${formatearPrecio(d.subtotal)}</strong></td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
  <title>Pedido ${det.codigo}</title>
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
    table{width:100%;border-collapse:collapse;margin-top:6px}
    th{background:#0f2953;color:#fff;padding:8px 10px;text-align:left;font-size:12px}
    td{padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:12.5px}
    tr:last-child td{border-bottom:none}
    .total-row{background:#f0f4ff}
    .total-row td{font-weight:700;font-size:14px;color:#0f2953}
    .badge{display:inline-block;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;background:#e0edff;color:#1a4fa0}
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
      <strong>Pedido ${det.codigo}</strong>
      Fecha: ${fecha}<br>
      Estado: <span class="badge">${det.estado?.replace('_', ' ')}</span>
    </div>
  </div>

  <div class="section">
    <h3>Datos del cliente</h3>
    <div class="grid2">
      <div><div class="lbl">Nombre</div>${det.cliente_nombre}</div>
      <div><div class="lbl">Teléfono</div>${det.cliente_telefono || '—'}</div>
      ${det.cliente_email ? `<div><div class="lbl">Correo</div>${det.cliente_email}</div>` : ''}
      ${det.cliente_empresa ? `<div><div class="lbl">Empresa</div>${det.cliente_empresa}</div>` : ''}
      <div><div class="lbl">Método de pago</div>${det.metodo_pago === 'sinpe' ? 'SINPE Móvil' : det.metodo_pago === 'transferencia_bancaria' ? 'Transferencia bancaria' : 'Coordinación por WhatsApp'}</div>
    </div>
  </div>

  <div class="section">
    <h3>Detalle de productos</h3>
    <table>
      <thead><tr><th>Producto</th><th style="text-align:center">Cant.</th><th style="text-align:right">P. unitario</th><th style="text-align:right">Subtotal</th></tr></thead>
      <tbody>${filas}</tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="3" style="text-align:right">Total a pagar</td>
          <td style="text-align:right">${formatearPrecio(det.total)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  ${det.notas ? `<div class="section"><h3>Notas</h3><p style="font-size:12.5px;color:#444">${det.notas}</p></div>` : ''}
  ${(det.requiere_entrega || det.direccion_entrega) ? `
  <div class="section">
    <h3>Datos de entrega</h3>
    <div class="grid2">
      ${det.zona_entrega ? `<div><div class="lbl">Zona</div>${det.zona_entrega === 'gam' ? 'Dentro del GAM' : 'Fuera del GAM (WhatsApp)'}</div>` : ''}
      ${det.direccion_entrega ? `<div style="grid-column:1/-1"><div class="lbl">Dirección</div>${det.direccion_entrega}</div>` : ''}
      ${det.indicaciones_entrega ? `<div style="grid-column:1/-1"><div class="lbl">Referencias / indicaciones</div>${det.indicaciones_entrega}</div>` : ''}
    </div>
  </div>` : ''}

  <div class="footer">Documento generado por el sistema Señaliza S.A. · ${new Date().toLocaleDateString('es-CR')}</div>

  <script>
    // Vista de previsualización (no imprime automáticamente)
    // El usuario puede usar Ctrl/Cmd + P o el botón para imprimir / guardar como PDF.
  <\/script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=820,height=1000');
  w.document.write(html);
  w.document.close();
}

const ESTADOS = [
  'pendiente', 'en_revision', 'pago_pendiente', 'pago_recibido', 'confirmado', 'rechazado', 'completado',
];
const ESTADO_TXT = {
  pendiente: 'Pendiente', en_revision: 'En revisión', pago_pendiente: 'Pago pendiente',
  pago_recibido: 'Pago recibido', confirmado: 'Confirmado', rechazado: 'Rechazado', completado: 'Completado',
};
const ESTADO_BADGE = {
  pendiente: 'badge-gris', en_revision: 'badge-amarillo', pago_pendiente: 'badge-amarillo',
  pago_recibido: 'badge-azul', confirmado: 'badge-verde', rechazado: 'badge-rojo', completado: 'badge-verde',
};
const PAGOS = ['pendiente', 'pagado', 'rechazado'];

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sel, setSel] = useState(null);
  const [det, setDet] = useState(null);

  // Filtros
  const [buscar, setBuscar] = useState('');
  const [fEstado, setFEstado] = useState('');
  const [fPago, setFPago] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  async function cargar() {
    setCargando(true);
    try { setPedidos(await api.adminPedidos()); } catch (e) { console.error(e); }
    setCargando(false);
  }
  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (q && !(`${p.codigo} ${p.cliente_nombre} ${p.cliente_telefono || ''}`.toLowerCase().includes(q))) return false;
      if (fEstado && p.estado !== fEstado) return false;
      if (fPago && p.estado_pago !== fPago) return false;
      if (!dentroDeRango(p.created_at, desde, hasta)) return false;
      return true;
    });
  }, [pedidos, buscar, fEstado, fPago, desde, hasta]);

  const hayFiltros = buscar || fEstado || fPago || desde || hasta;
  function limpiar() { setBuscar(''); setFEstado(''); setFPago(''); setDesde(''); setHasta(''); }

  async function abrir(p) {
    setSel(p); setDet(null);
    try { setDet(await api.adminPedido(p.id)); } catch (e) { console.error(e); }
  }

  async function cambiar(campo, valor) {
    try {
      await api.estadoPedido(sel.id, { [campo]: valor });
      const fresco = await api.adminPedido(sel.id);
      setDet(fresco);
      setPedidos((arr) => arr.map((x) => (x.id === sel.id ? { ...x, [campo]: valor } : x)));
    } catch (e) { alert(e.message); }
  }

  async function validar(cid) {
    try { await api.validarComprobante(cid); setDet(await api.adminPedido(sel.id)); }
    catch (e) { alert(e.message); }
  }

  return (
    <div className="panel">
      <div className="panel-head"><h2>Pedidos ({pedidos.length})</h2></div>

      <div className="adm-filtros">
        <div className="adm-f adm-f-buscar">
          <label>Buscar</label>
          <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Código, cliente o teléfono…" />
        </div>
        <div className="adm-f">
          <label>Estado</label>
          <select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => <option key={s} value={s}>{ESTADO_TXT[s]}</option>)}
          </select>
        </div>
        <div className="adm-f">
          <label>Pago</label>
          <select value={fPago} onChange={(e) => setFPago(e.target.value)}>
            <option value="">Todos</option>
            {PAGOS.map((s) => <option key={s} value={s}>{s}</option>)}
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
        <span className="adm-f-conteo">{filtrados.length} de {pedidos.length}</span>
      </div>

      <div className="panel-body" style={{ padding: 0 }}>
        {cargando ? <div className="vacio">Cargando…</div>
          : pedidos.length === 0 ? <div className="vacio">Aún no hay pedidos.</div>
            : filtrados.length === 0 ? <div className="vacio">Ningún pedido coincide con los filtros.</div>
            : (
              <table className="tabla">
                <thead>
                  <tr><th>Código</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Pago</th><th>Fecha</th><th></th></tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => {
                    const wspMsg = `Hola ${p.cliente_nombre}, respecto a tu pedido ${p.codigo} por ${formatearPrecio(p.total)}.`;
                    return (
                      <tr key={p.id}>
                        <td><strong>{p.codigo}</strong></td>
                        <td>
                          {p.cliente_nombre}
                          <br />
                          <span className="muted">
                            {p.cliente_telefono}
                            {p.cliente_telefono && (
                              <a
                                href={linkWhatsApp(p.cliente_telefono, wspMsg)}
                                target="_blank"
                                rel="noreferrer"
                                title="Contactar por WhatsApp"
                                style={{ marginLeft: 6, color: '#25D366', display: 'inline-flex', verticalAlign: 'middle' }}
                              >
                                <IconWhatsApp size={14} />
                              </a>
                            )}
                          </span>
                        </td>
                        <td>{formatearPrecio(p.total)}</td>
                        <td><span className={`badge ${ESTADO_BADGE[p.estado]}`}>{ESTADO_TXT[p.estado]}</span></td>
                        <td><span className={`badge ${p.estado_pago === 'pagado' ? 'badge-verde' : p.estado_pago === 'rechazado' ? 'badge-rojo' : 'badge-gris'}`}>{p.estado_pago}</span></td>
                        <td className="muted">{new Date(p.created_at).toLocaleDateString('es-CR')}</td>
                        <td>
                          <div className="fila" style={{ gap: 6, justifyContent: 'flex-end' }}>
                            <button className="btn btn-fantasma btn-sm" onClick={() => abrir(p)}>Ver</button>
                            {p.cliente_telefono && (
                              <a
                                href={linkWhatsApp(p.cliente_telefono, wspMsg)}
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
                    );
                  })}
                </tbody>
              </table>
            )}
      </div>

      {sel && (
        <div className="modal-fondo" onClick={() => setSel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Pedido {sel.codigo}</h3>
              <button onClick={() => setSel(null)}><IconClose /></button>
            </div>
            <div className="modal-body">
              {!det ? <div className="vacio">Cargando…</div> : (
                <>
                  <div className="card" style={{ padding: 16, marginBottom: 16 }}>
                    <strong>Datos del cliente</strong>
                    <div style={{ marginTop: 8, lineHeight: 1.7 }}>
                      {det.cliente_nombre}<br />
                      Tel: {det.cliente_telefono}
                      {det.cliente_telefono && (
                        <a
                          href={linkWhatsApp(det.cliente_telefono, `Hola ${det.cliente_nombre}, respecto a tu pedido ${det.codigo} por ${formatearPrecio(det.total)}.`)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ marginLeft: 8, color: '#25D366', display: 'inline-flex', verticalAlign: 'middle' }}
                          title="Contactar por WhatsApp"
                        >
                          <IconWhatsApp size={17} />
                        </a>
                      )}
                      <br />
                      {det.cliente_email && <>Correo: {det.cliente_email}<br /></>}
                      {det.cliente_empresa && <>Empresa: {det.cliente_empresa}<br /></>}
                      Método: {det.metodo_pago === 'sinpe' ? 'SINPE Móvil' : det.metodo_pago === 'transferencia_bancaria' ? 'Transferencia bancaria' : 'Coordinación por WhatsApp'}
                    </div>
                    {det.notas && <p className="muted" style={{ marginTop: 8 }}>Notas: {det.notas}</p>}
                    {(det.requiere_entrega || det.direccion_entrega) && (
                      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
                        <strong style={{ fontSize: '0.95rem' }}>Entrega a domicilio</strong>
                        <div style={{ fontSize: '0.92rem', marginTop: 4, lineHeight: 1.5 }}>
                          {det.zona_entrega && (
                            <div>Zona: <strong>{det.zona_entrega === 'gam' ? 'Dentro del GAM' : 'Fuera del GAM (WhatsApp)'}</strong></div>
                          )}
                          {det.direccion_entrega && <div>Dirección: {det.direccion_entrega}</div>}
                          {det.indicaciones_entrega && <div>Referencias: {det.indicaciones_entrega}</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  <strong>Productos</strong>
                  <table className="tabla" style={{ margin: '8px 0 16px' }}>
                    <thead><tr><th>Producto</th><th>Cant.</th><th>P. unit.</th><th>Subtotal</th></tr></thead>
                    <tbody>
                      {det.detalle?.map((d) => (
                        <tr key={d.id}>
                          <td>{d.producto_nombre}</td>
                          <td>{d.cantidad}</td>
                          <td>{formatearPrecio(d.precio_unitario)}</td>
                          <td>{formatearPrecio(d.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="fila" style={{ justifyContent: 'flex-end', fontSize: '1.15rem', fontWeight: 700, color: 'var(--azul-900)', marginBottom: 18 }}>
                    Total a pagar:&nbsp;{formatearPrecio(det.total)}
                  </div>

                  <strong>Comprobantes de pago</strong>
                  {det.comprobantes?.length ? det.comprobantes.map((c) => (
                    <div key={c.id} className="card" style={{ padding: 12, marginTop: 8 }}>
                      <div className="fila" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                        <div>
                          <button
                            type="button"
                            className="btn btn-fantasma btn-sm"
                            onClick={() => abrirArchivoPrivado(`/admin/comprobantes/${c.id}/archivo`).catch((e) => alert(e.message))}
                          >
                            Ver comprobante
                          </button>
                          {c.referencia && <span className="muted" style={{ marginLeft: 10 }}>Ref: {c.referencia}</span>}
                        </div>
                        {c.validado
                          ? <span className="badge badge-verde"><IconCheck /> Validado</span>
                          : <button className="btn btn-primario btn-sm" onClick={() => validar(c.id)}><IconCheck /> Validar</button>}
                      </div>
                    </div>
                  )) : <p className="muted" style={{ marginTop: 6 }}>Sin comprobantes subidos.</p>}

                  <div className="campo-row" style={{ marginTop: 18 }}>
                    <div>
                      <label className="lbl">Estado del pedido</label>
                      <select className="campo" value={det.estado} onChange={(e) => cambiar('estado', e.target.value)}>
                        {ESTADOS.map((s) => <option key={s} value={s}>{ESTADO_TXT[s]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="lbl">Estado del pago</label>
                      <select className="campo" value={det.estado_pago} onChange={(e) => cambiar('estado_pago', e.target.value)}>
                        {PAGOS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-fantasma" onClick={() => setSel(null)}>Cerrar</button>
              {det && det.cliente_telefono && (
                <a
                  className="btn btn-fantasma btn-sm"
                  href={linkWhatsApp(det.cliente_telefono, `Hola ${det.cliente_nombre}, respecto a tu pedido ${det.codigo} por ${formatearPrecio(det.total)}.`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <IconWhatsApp size={16} /> WhatsApp
                </a>
              )}
              {det && (
                <button className="btn btn-fantasma btn-sm" onClick={() => imprimirPedido(det)}>
                  👁 Previsualizar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
