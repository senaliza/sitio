import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, formatearPrecio } from '../services/api.js';
import { useCarrito } from '../context/CarritoContext.jsx';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import ImagenProducto from '../components/ImagenProducto.jsx';
import { IconCart, IconWhatsApp, IconArrow, IconCheck } from '../components/Icons.jsx';

export default function ProductoDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { agregar } = useCarrito();
  const { contacto } = useContenido();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    setProducto(null); setError('');
    api.producto(slug).then(setProducto).catch(() => setError('Producto no encontrado'));
  }, [slug]);

  if (error) return <div className="contenedor seccion"><p className="muted">{error}</p><Link to="/productos" className="btn btn-fantasma">Volver a productos</Link></div>;
  if (!producto) return <div className="contenedor seccion"><p className="muted">Cargando...</p></div>;

  const tienePrecio = producto.precio != null;
  const opciones = (() => { try { return producto.opciones ? JSON.parse(producto.opciones) : null; } catch { return null; } })();
  const msgWsp = `Hola, me interesa el producto: ${producto.nombre}${tienePrecio ? ` (${formatearPrecio(producto.precio)})` : ''}.`;

  const handleAgregar = () => {
    agregar(producto, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1800);
  };

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="breadcrumb muted">
          <Link to="/productos">Productos</Link> / {producto.categoria_nombre} / <span>{producto.nombre}</span>
        </div>

        <div className="det-grid">
          <div className="det-imagen card">
            <ImagenProducto producto={producto} alto={420} />
          </div>

          <div className="det-info">
            {producto.categoria_nombre && <span className="badge badge-azul" style={{ marginBottom: 12 }}>{producto.categoria_nombre}</span>}
            <h1 className="det-titulo">{producto.nombre}</h1>

            <div className="det-precio">
              {tienePrecio ? (
                <>
                  <span className="precio" style={{ fontSize: '2rem' }}>{formatearPrecio(producto.precio)}</span>
                  <span className="nota-iva">Precio final · sin cargos adicionales</span>
                </>
              ) : (
                <span className="precio-cotizar" style={{ fontSize: '1.1rem' }}>Precio a cotizar según especificaciones</span>
              )}
            </div>

            <p className="det-desc">{producto.descripcion || producto.descripcion_corta}</p>

            {opciones && Array.isArray(opciones) && (
              <div style={{ marginBottom: 20 }}>
                <strong style={{ display: 'block', marginBottom: 8 }}>Opciones disponibles</strong>
                <ul className="det-opciones">
                  {opciones.map((o, i) => <li key={i}><IconCheck size={15} /> {o}</li>)}
                </ul>
              </div>
            )}

            {tienePrecio && (
              <div className="det-cantidad">
                <label>Cantidad</label>
                <div className="qty">
                  <button onClick={() => setCantidad((c) => Math.max(1, c - 1))}>−</button>
                  <span>{cantidad}</span>
                  <button onClick={() => setCantidad((c) => c + 1)}>+</button>
                </div>
              </div>
            )}

            {agregado && <div className="alerta alerta-ok"><IconCheck size={16} /> Producto agregado al carrito</div>}

            <div className="det-acciones">
              {tienePrecio ? (
                <>
                  <button className="btn btn-primario" onClick={handleAgregar}><IconCart size={18} /> Agregar al carrito</button>
                  <button className="btn btn-rojo" onClick={() => { agregar(producto, cantidad); navigate('/carrito'); }}>Comprar ahora</button>
                </>
              ) : (
                <Link to="/cotizar" className="btn btn-rojo">Solicitar cotización</Link>
              )}
              <a className="btn btn-wsp" href={linkWhatsApp(contacto.whatsapp, msgWsp)} target="_blank" rel="noreferrer">
                <IconWhatsApp size={18} /> Consultar
              </a>
            </div>

            <Link to="/productos" className="det-volver muted">← Seguir explorando los productos <IconArrow size={15} /></Link>
          </div>
        </div>
      </div>

      <style>{`
        .breadcrumb { font-size: 0.86rem; margin-bottom: 24px; }
        .breadcrumb a:hover { color: var(--azul-600); }
        .det-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
        .det-imagen { overflow: hidden; }
        .det-titulo { font-size: clamp(1.6rem, 3vw, 2.2rem); margin-bottom: 16px; }
        .det-precio { display: flex; flex-direction: column; gap: 4px; margin-bottom: 22px; padding-bottom: 22px; border-bottom: 1px solid var(--gris-200); }
        .det-desc { color: var(--texto-suave); margin-bottom: 22px; line-height: 1.7; }
        .det-opciones li { display: flex; align-items: center; gap: 8px; color: var(--gris-700); margin-bottom: 6px; font-size: 0.94rem; }
        .det-opciones svg { color: var(--azul-600); }
        .det-cantidad { margin-bottom: 22px; }
        .det-cantidad label { display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; color: var(--gris-700); }
        .qty { display: inline-flex; align-items: center; border: 1.5px solid var(--gris-200); border-radius: var(--radio-pill); overflow: hidden; background: #fff; }
        .qty button { width: 44px; height: 44px; border: none; background: var(--gris-50); font-size: 1.3rem; cursor: pointer; color: var(--azul-900); transition: background var(--transicion); }
        .qty button:hover { background: var(--azul-100); color: var(--azul-700); }
        .qty span { width: 52px; text-align: center; font-weight: 700; }
        .det-acciones { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        .det-volver { display: inline-flex; align-items: center; gap: 6px; font-size: 0.9rem; }
        @media (max-width: 860px) { .det-grid { grid-template-columns: 1fr; gap: 28px; } }
      `}</style>
    </section>
  );
}
