import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import { formatearPrecio } from '../services/api.js';
import ImagenProducto from '../components/ImagenProducto.jsx';
import { IconTrash, IconWhatsApp, IconCart, IconArrow } from '../components/Icons.jsx';

export default function Carrito() {
  const { items, total, cambiarCantidad, eliminar } = useCarrito();
  const { contacto } = useContenido();

  if (items.length === 0) {
    return (
      <section className="seccion">
        <div className="contenedor centro vacio">
          <span className="vacio-icono"><IconCart size={40} /></span>
          <h2>Su carrito está vacío</h2>
          <p className="muted">Explore nuestros productos y agréguelos al carrito.</p>
          <Link to="/productos" className="btn btn-primario">Ver productos <IconArrow size={17} /></Link>
        </div>
        <style>{`.vacio { padding: 40px 0; } .vacio-icono { display: inline-grid; place-items: center; width: 80px; height: 80px; border-radius: 50%; background: var(--azul-100); color: var(--azul-700); margin-bottom: 20px; } .vacio h2 { margin-bottom: 8px; } .vacio .btn { margin-top: 20px; }`}</style>
      </section>
    );
  }

  const msgWsp = `Hola, quisiera coordinar este pedido:\n${items.map((i) => `• ${i.nombre} x${i.cantidad} = ${formatearPrecio(i.precio * i.cantidad)}`).join('\n')}\nTotal: ${formatearPrecio(total)}`;

  return (
    <section className="seccion">
      <div className="contenedor">
        <h1 className="seccion-titulo">Resumen de su pedido</h1>

        <div className="carrito-grid">
          <div className="carrito-items">
            {items.map((i) => (
              <div className="citem card" key={i.id}>
                <div className="citem-img"><ImagenProducto producto={i} alto={90} /></div>
                <div className="citem-info">
                  <h3>{i.nombre}</h3>
                  <span className="precio">{formatearPrecio(i.precio)}</span>
                  <span className="nota-iva"> c/u</span>
                </div>
                <div className="qty">
                  <button onClick={() => cambiarCantidad(i.id, i.cantidad - 1)}>−</button>
                  <span>{i.cantidad}</span>
                  <button onClick={() => cambiarCantidad(i.id, i.cantidad + 1)}>+</button>
                </div>
                <div className="citem-sub">{formatearPrecio(i.precio * i.cantidad)}</div>
                <button className="citem-del" onClick={() => eliminar(i.id)} aria-label="Eliminar"><IconTrash size={18} /></button>
              </div>
            ))}
          </div>

          <aside className="carrito-resumen card">
            <h3>Resumen</h3>
            {/* Resumen SIN IVA: solo productos y el total exacto */}
            <div className="resumen-linea"><span>Productos ({items.reduce((a, i) => a + i.cantidad, 0)})</span><span>{formatearPrecio(total)}</span></div>
            <div className="resumen-total">
              <span>Total a pagar</span>
              <span className="precio" style={{ fontSize: '1.5rem' }}>{formatearPrecio(total)}</span>
            </div>
            <p className="nota-iva" style={{ marginBottom: 18 }}>El monto mostrado es el total final exacto.</p>
            <Link to="/checkout" className="btn btn-primario btn-bloque">Continuar al pedido</Link>
            <a className="btn btn-wsp btn-bloque" style={{ marginTop: 10 }}
              href={linkWhatsApp(contacto.whatsapp, msgWsp)} target="_blank" rel="noreferrer">
              <IconWhatsApp size={18} /> Coordinar por WhatsApp
            </a>
          </aside>
        </div>
      </div>

      <style>{`
        .carrito-grid { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }
        .citem { display: grid; grid-template-columns: 90px 1fr auto auto 40px; align-items: center; gap: 16px; padding: 14px; margin-bottom: 14px; }
        .citem-img { width: 90px; height: 90px; border-radius: 10px; overflow: hidden; }
        .citem-info h3 { font-size: 1rem; margin-bottom: 4px; }
        .citem-sub { font-family: var(--fuente-display); font-weight: 700; color: var(--azul-900); }
        .citem-del { background: none; border: none; color: var(--gris-500); cursor: pointer; }
        .citem-del:hover { color: var(--rojo); }
        .qty { display: inline-flex; align-items: center; border: 1.5px solid var(--gris-200); border-radius: 9px; overflow: hidden; }
        .qty button { width: 34px; height: 34px; border: none; background: var(--gris-50); font-size: 1.1rem; cursor: pointer; color: var(--azul-900); }
        .qty span { width: 38px; text-align: center; font-weight: 700; font-size: 0.92rem; }
        .carrito-resumen { padding: 24px; position: sticky; top: 90px; }
        .carrito-resumen h3 { margin-bottom: 18px; }
        .resumen-linea { display: flex; justify-content: space-between; color: var(--texto-suave); margin-bottom: 14px; font-size: 0.95rem; }
        .resumen-total { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--gris-200); margin-bottom: 6px; }
        .resumen-total > span:first-child { font-weight: 700; color: var(--azul-900); }
        @media (max-width: 860px) {
          .carrito-grid { grid-template-columns: 1fr; }
          .citem { grid-template-columns: 70px 1fr auto; grid-template-areas: 'img info del' 'img qty sub'; }
          .citem-img { width: 70px; height: 70px; grid-area: img; }
          .citem-info { grid-area: info; } .qty { grid-area: qty; } .citem-sub { grid-area: sub; text-align: right; } .citem-del { grid-area: del; justify-self: end; }
          .carrito-resumen { position: static; }
        }
      `}</style>
    </section>
  );
}
