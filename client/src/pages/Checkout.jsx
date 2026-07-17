import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import { api, formatearPrecio } from '../services/api.js';
import { IconCard, IconWhatsApp, IconUpload, IconCheck } from '../components/Icons.jsx';

export default function Checkout() {
  const { items, total, vaciar } = useCarrito();
  const { contacto } = useContenido();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({ nombre: '', telefono: '', email: '', empresa: '' });
  const [metodoPago, setMetodoPago] = useState('sinpe');
  const [notas, setNotas] = useState('');
  const [entrega, setEntrega] = useState({ requiere: false, zona: 'gam', direccion: '', indicaciones: '' });
  const [comprobante, setComprobante] = useState(null);
  const [referencia, setReferencia] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [pedido, setPedido] = useState(null); // pedido confirmado
  const [copiadoIban, setCopiadoIban] = useState(false);

  const set = (k) => (e) => setCliente((c) => ({ ...c, [k]: e.target.value }));

  const seleccionarMetodo = (m) => {
    if (m !== metodoPago) {
      setMetodoPago(m);
      setReferencia('');
      setComprobante(null);
      setCopiadoIban(false);
    }
  };

  const copiarIban = () => {
    const iban = contacto.transferencia_iban || '';
    if (!iban || !navigator.clipboard) return;
    navigator.clipboard.writeText(iban).then(() => {
      setCopiadoIban(true);
      setTimeout(() => setCopiadoIban(false), 1800);
    });
  };

  if (items.length === 0 && !pedido) {
    return (
      <section className="seccion"><div className="contenedor centro">
        <h2>No hay productos en el carrito</h2>
        <Link to="/productos" className="btn btn-primario" style={{ marginTop: 16 }}>Ver productos</Link>
      </div></section>
    );
  }

  const enviarPedido = async () => {
    setError('');
    if (!cliente.nombre || !cliente.telefono) { setError('Nombre y teléfono son obligatorios.'); return; }
    if (metodoPago === 'transferencia_bancaria') {
      if (!referencia.trim()) { setError('Ingresa el número de transferencia.'); return; }
      if (!comprobante) { setError('Adjunta el comprobante de la transferencia bancaria.'); return; }
    }
    setEnviando(true);
    try {
      const body = {
        cliente,
        metodo_pago: metodoPago,
        notas,
        requiere_entrega: !!entrega.requiere,
        zona_entrega: entrega.requiere ? entrega.zona : null,
        direccion_entrega: entrega.requiere && entrega.direccion ? entrega.direccion.trim() : null,
        indicaciones_entrega: entrega.requiere && entrega.indicaciones ? entrega.indicaciones.trim() : null,
        items: items.map((i) => ({ producto_id: i.id, cantidad: i.cantidad })),
      };
      const res = await api.crearPedido(body); // el total lo recalcula el servidor (sin IVA)

      // SINPE o transferencia: si hay comprobante adjunto se sube (transferencia siempre lo exige)
      const esConComprobante = metodoPago === 'sinpe' || metodoPago === 'transferencia_bancaria';
      let comprobanteWarning = null;
      if (esConComprobante && comprobante) {
        const form = new FormData();
        form.append('comprobante', comprobante);
        form.append('referencia', referencia);
        form.append('token', res.token); // autoriza la subida para ESTE pedido
        try {
          await api.subirComprobante(res.id, form);
        } catch (upErr) {
          // El pedido ya se creó exitosamente. No bloqueamos la confirmación.
          comprobanteWarning = upErr?.message || 'No se pudo adjuntar el comprobante. Escríbenos por WhatsApp con tu código de pedido para validarlo.';
        }
      }
      setPedido({ ...res, comprobanteWarning });
      vaciar();
    } catch (e) {
      setError(e.message || 'No se pudo enviar el pedido.');
    } finally {
      setEnviando(false);
    }
  };

  // Confirmación
  if (pedido) {
    return (
      <section className="seccion"><div className="contenedor centro confirm">
        <span className="confirm-icono"><IconCheck size={42} /></span>
        <h1>¡Pedido enviado!</h1>
        <p className="muted">Su pedido <strong>{pedido.codigo}</strong> fue recibido y está en revisión.</p>
        <div className="confirm-total card">
          <span>Total del pedido</span>
          <span className="precio" style={{ fontSize: '1.6rem' }}>{formatearPrecio(pedido.total)}</span>
        </div>
        {pedido.comprobanteWarning && (
          <div style={{ maxWidth: 520, margin: '0 auto 16px', background: '#fef3c7', color: '#92400e', border: '1px solid #f59e0b', padding: '12px 16px', borderRadius: 8, fontSize: '0.92rem' }}>
            {pedido.comprobanteWarning}
          </div>
        )}
        <p className="muted" style={{ maxWidth: 460, margin: '0 auto 22px' }}>
          {metodoPago === 'sinpe' || metodoPago === 'transferencia_bancaria'
            ? 'Validaremos su comprobante de pago y le confirmaremos. El pedido no se confirma automáticamente.'
            : 'Le contactaremos por WhatsApp para coordinar el pago y la entrega.'}
        </p>
        <div className="fila" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <a className="btn btn-wsp" href={linkWhatsApp(contacto.whatsapp, `Hola, acabo de enviar el pedido ${pedido.codigo}.`)} target="_blank" rel="noreferrer">
            <IconWhatsApp size={18} /> Escribir por WhatsApp
          </a>
          <Link to="/productos" className="btn btn-fantasma">Volver a productos</Link>
        </div>
        <style>{`.confirm { padding: 30px 0; } .confirm-icono { display:inline-grid; place-items:center; width:84px; height:84px; border-radius:50%; background:#dcfce7; color:#15803d; margin-bottom:20px; } .confirm h1 { margin-bottom:10px; } .confirm-total { display:flex; justify-content:space-between; align-items:center; max-width:380px; margin:24px auto; padding:18px 24px; } .confirm-total > span:first-child { font-weight:600; color: var(--azul-900); }`}</style>
      </div></section>
    );
  }

  return (
    <section className="seccion">
      <div className="contenedor">
        <h1 className="seccion-titulo">Finalizar pedido</h1>

        {error && <div className="alerta alerta-error">{error}</div>}

        <div className="checkout-grid">
          <div>
            {/* Datos del cliente */}
            <div className="card seccion-form">
              <h3>Datos del cliente</h3>
              <div className="grid-2">
                <div className="campo"><label>Nombre completo *</label><input value={cliente.nombre} onChange={set('nombre')} /></div>
                <div className="campo"><label>Teléfono *</label><input value={cliente.telefono} onChange={set('telefono')} /></div>
                <div className="campo"><label>Correo electrónico</label><input type="email" value={cliente.email} onChange={set('email')} /></div>
                <div className="campo"><label>Empresa</label><input value={cliente.empresa} onChange={set('empresa')} /></div>
              </div>
              <div className="campo"><label>Notas del pedido</label><textarea value={notas} onChange={(e) => setNotas(e.target.value)} placeholder="Indicaciones, medidas, detalles..." /></div>
            </div>

            {/* Entrega a domicilio (opcional) */}
            <div className="card seccion-form">
              <h3>Entrega a domicilio (opcional)</h3>
              <p className="nota-gam">
                Entregas a domicilio disponibles <strong>únicamente en el Gran Área Metropolitana (GAM)</strong> de Costa Rica.
                Si se encuentra fuera del GAM, la entrega se coordinará posteriormente por WhatsApp.
              </p>
              <label className="check-entrega">
                <input
                  type="checkbox"
                  checked={entrega.requiere}
                  onChange={(e) => {
                    const requiere = e.target.checked;
                    setEntrega((prev) => ({
                      ...prev,
                      requiere,
                      zona: requiere ? prev.zona : 'gam',
                    }));
                  }}
                />
                <span>Solicito entrega a domicilio en mi dirección</span>
              </label>

              {entrega.requiere && (
                <div className="entrega-campos">
                  <div className="zona-opciones">
                    <button
                      type="button"
                      className={`zona-btn ${entrega.zona === 'gam' ? 'on' : ''}`}
                      onClick={() => setEntrega((e) => ({ ...e, zona: 'gam' }))}
                    >
                      Dentro del GAM
                    </button>
                    <button
                      type="button"
                      className={`zona-btn ${entrega.zona === 'fuera_gam' ? 'on' : ''}`}
                      onClick={() => setEntrega((e) => ({ ...e, zona: 'fuera_gam' }))}
                    >
                      Fuera del GAM (se coordinará por WhatsApp)
                    </button>
                  </div>

                  <div className="campo">
                    <label>Dirección completa</label>
                    <input
                      value={entrega.direccion}
                      onChange={(e) => setEntrega((prev) => ({ ...prev, direccion: e.target.value }))}
                      placeholder="Calle / avenida, número, barrio o distrito, cantón, provincia"
                    />
                    <small className="muted" style={{ display: 'block', marginTop: 4 }}>Ej: 50m sur del Walmart Escazú, casa #123, San José</small>
                  </div>
                  <div className="campo">
                    <label>Referencias / indicaciones adicionales (opcional)</label>
                    <textarea
                      value={entrega.indicaciones}
                      onChange={(e) => setEntrega((prev) => ({ ...prev, indicaciones: e.target.value }))}
                      placeholder="Color de casa, portón, punto de referencia, piso, apartamento..."
                      rows={2}
                    />
                  </div>

                  {entrega.zona === 'fuera_gam' && (
                    <div style={{ marginTop: 8, fontSize: '0.9rem', background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171', padding: '8px 10px', borderRadius: 8 }}>
                      Entrega fuera del GAM: nos contactaremos por WhatsApp para coordinar el envío y costos adicionales si aplica.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Método de pago */}
            <div className="card seccion-form">
              <h3>Método de pago</h3>
              <div className="pago-opciones">
                <button className={`pago-op ${metodoPago === 'sinpe' ? 'on' : ''}`} onClick={() => seleccionarMetodo('sinpe')}>
                  <IconCard size={22} /><div><strong>SINPE Móvil</strong><span>Transferencia + comprobante</span></div>
                </button>
                <button className={`pago-op ${metodoPago === 'transferencia_bancaria' ? 'on' : ''}`} onClick={() => seleccionarMetodo('transferencia_bancaria')}>
                  <IconCard size={22} /><div><strong>Transferencia bancaria</strong><span>Número de transferencia + comprobante</span></div>
                </button>
                <button className={`pago-op ${metodoPago === 'whatsapp' ? 'on' : ''}`} onClick={() => seleccionarMetodo('whatsapp')}>
                  <IconWhatsApp size={22} /><div><strong>Coordinar por WhatsApp</strong><span>Acordamos el pago con usted</span></div>
                </button>
              </div>

              {metodoPago === 'sinpe' && (
                <div className="pago-info-box">
                  <div className="pago-datos">
                    <p><strong>Número SINPE:</strong> {contacto.sinpe_numero}</p>
                    <p><strong>A nombre de:</strong> {contacto.sinpe_nombre}</p>
                    <p className="precio">Monto exacto: {formatearPrecio(total)}</p>
                  </div>
                  <div className="campo"><label>Número de referencia (opcional)</label><input value={referencia} onChange={(e) => setReferencia(e.target.value)} /></div>
                  <div className="campo">
                    <label>Comprobante de pago</label>
                    <label className="upload">
                      <IconUpload size={20} />
                      <span>{comprobante ? comprobante.name : 'Subir imagen del comprobante'}</span>
                      <input type="file" accept="image/*,.pdf" hidden onChange={(e) => setComprobante(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              )}

              {metodoPago === 'transferencia_bancaria' && (
                <div className="pago-info-box">
                  <div className="pago-datos">
                    <p>
                      <strong>IBAN:</strong> {contacto.transferencia_iban || '—'}
                      <button type="button" className="btn-copiar" onClick={copiarIban} disabled={!contacto.transferencia_iban}>
                        {copiadoIban ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </p>
                    <p><strong>A nombre de:</strong> {contacto.transferencia_nombre}</p>
                    <p className="precio">Monto exacto: {formatearPrecio(total)}</p>
                  </div>
                  <div className="campo"><label>Número de transferencia *</label><input value={referencia} onChange={(e) => setReferencia(e.target.value)} /></div>
                  <div className="campo">
                    <label>Comprobante de pago *</label>
                    <label className="upload">
                      <IconUpload size={20} />
                      <span>{comprobante ? comprobante.name : 'Subir imagen o PDF del comprobante'}</span>
                      <input type="file" accept="image/*,.pdf" hidden onChange={(e) => setComprobante(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resumen del pedido SIN IVA */}
          <aside className="card resumen-checkout">
            <h3>Su pedido</h3>
            <div className="resumen-items">
              {items.map((i) => (
                <div className="ri" key={i.id}>
                  <span className="ri-nombre">{i.nombre}</span>
                  <span className="ri-detalle">{i.cantidad} × {formatearPrecio(i.precio)}</span>
                  <span className="ri-sub">{formatearPrecio(i.precio * i.cantidad)}</span>
                </div>
              ))}
            </div>
            {/* No se muestra línea de IVA. El total es la suma exacta. */}
            <div className="resumen-total">
              <span>Total final</span>
              <span className="precio" style={{ fontSize: '1.5rem' }}>{formatearPrecio(total)}</span>
            </div>
            <p className="nota-iva" style={{ marginBottom: 16 }}>Monto exacto a pagar, sin cargos adicionales.</p>
            <button className="btn btn-rojo btn-bloque" disabled={enviando} onClick={enviarPedido}>
              {enviando ? 'Enviando...' : 'Enviar pedido'}
            </button>
            <p className="nota-iva centro" style={{ marginTop: 12 }}>El pedido será revisado por nuestro equipo.</p>
          </aside>
        </div>
      </div>

      <style>{`
        .checkout-grid { display: grid; grid-template-columns: 1fr 360px; gap: 28px; align-items: start; }
        .seccion-form { padding: 26px; margin-bottom: 22px; }
        .seccion-form h3 { margin-bottom: 18px; }
        .pago-opciones { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 18px; }
        .pago-op { display: flex; align-items: center; gap: 12px; text-align: left; padding: 16px; border: 1.5px solid var(--gris-200);
          border-radius: 12px; background: #fff; cursor: pointer; font-family: var(--fuente-texto); transition: all .16s; }
        .pago-op svg { color: var(--azul-700); flex-shrink: 0; }
        .pago-op strong { display: block; color: var(--azul-900); font-size: 0.95rem; }
        .pago-op span { font-size: 0.82rem; color: var(--texto-suave); }
        .pago-op.on { border-color: var(--azul-600); background: var(--azul-50); }
        .pago-info-box { border-top: 1px solid var(--gris-200); padding-top: 18px; }
        .pago-datos { background: var(--azul-50); border-radius: 10px; padding: 16px; margin-bottom: 18px; font-size: 0.94rem; }
        .pago-datos p { margin-bottom: 4px; }
        .btn-copiar { margin-left: 8px; font-size: 0.75rem; padding: 2px 8px; border: 1px solid var(--azul-300); background: #fff; border-radius: 6px; cursor: pointer; color: var(--azul-700); }
        .btn-copiar:hover { background: var(--azul-50); }
        .btn-copiar:disabled { opacity: 0.5; cursor: default; }
        .upload { display: flex; align-items: center; gap: 10px; padding: 14px; border: 1.5px dashed var(--gris-300);
          border-radius: 10px; cursor: pointer; color: var(--gris-600); font-size: 0.92rem; transition: border .16s; }
        .upload:hover { border-color: var(--azul-600); color: var(--azul-700); }
        .resumen-checkout { padding: 24px; position: sticky; top: 90px; }
        .resumen-checkout h3 { margin-bottom: 16px; }
        .resumen-items { margin-bottom: 16px; }
        .ri { display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; padding: 10px 0; border-bottom: 1px solid var(--gris-100); }
        .ri-nombre { font-weight: 600; font-size: 0.92rem; }
        .ri-detalle { grid-column: 1; font-size: 0.82rem; color: var(--texto-suave); }
        .ri-sub { grid-row: 1 / span 2; align-self: center; font-weight: 700; color: var(--azul-900); }
        .resumen-total { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--gris-200); margin-bottom: 4px; }
        .resumen-total > span:first-child { font-weight: 700; color: var(--azul-900); }
        .nota-gam { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 10px 12px; border-radius: 8px; font-size: 0.9rem; margin-bottom: 12px; }
        .check-entrega { display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none; margin-bottom: 4px; }
        .check-entrega input { width: 18px; height: 18px; accent-color: var(--azul-600); }
        .entrega-campos { margin-top: 12px; }
        .zona-opciones { display: flex; gap: 8px; margin-bottom: 12px; }
        .zona-btn { flex: 1; padding: 10px 12px; border: 1.5px solid var(--gris-200); background: #fff; border-radius: 10px; font-size: 0.9rem; cursor: pointer; text-align: center; transition: all .12s; }
        .zona-btn.on { border-color: var(--azul-600); background: var(--azul-50); color: var(--azul-800); font-weight: 600; }
        .zona-btn:hover:not(.on) { border-color: var(--gris-300); }
        @media (max-width: 880px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .pago-opciones { grid-template-columns: 1fr; }
          .resumen-checkout { position: static; }
          .zona-opciones { flex-direction: column; }
        }
      `}</style>
    </section>
  );
}
