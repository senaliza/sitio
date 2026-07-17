import { Link } from 'react-router-dom';
import ImagenProducto from './ImagenProducto.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';
import { formatearPrecio } from '../services/api.js';
import { IconCart, IconArrow } from './Icons.jsx';

export default function ProductoCard({ producto }) {
  const { agregar } = useCarrito();
  const tienePrecio = producto.precio != null;

  return (
    <article className="card pcard">
      <Link to={`/producto/${producto.slug}`} className="pcard-img">
        <ImagenProducto producto={producto} alto={200} />
        {producto.categoria_nombre && (
          <span className="pcard-cat-float badge badge-azul">{producto.categoria_nombre}</span>
        )}
      </Link>
      <div className="pcard-body">
        <h3 className="pcard-titulo">
          <Link to={`/producto/${producto.slug}`}>{producto.nombre}</Link>
        </h3>
        <p className="pcard-desc">{producto.descripcion_corta}</p>

        <div className="pcard-precio">
          {tienePrecio
            ? <span className="precio" style={{ fontSize: '1.3rem' }}>{formatearPrecio(producto.precio)}</span>
            : <span className="precio-cotizar">Precio a cotizar</span>}
        </div>

        <div className="pcard-acciones">
          {tienePrecio ? (
            <button className="btn btn-primario btn-sm btn-bloque" onClick={() => agregar(producto)}>
              <IconCart size={17} /> Agregar
            </button>
          ) : (
            <Link to="/cotizar" className="btn btn-rojo btn-sm btn-bloque">Cotizar</Link>
          )}
          <Link to={`/producto/${producto.slug}`} className="btn btn-fantasma btn-sm" aria-label="Ver detalle">
            <IconArrow size={17} />
          </Link>
        </div>
      </div>

      <style>{`
        .pcard { display: flex; flex-direction: column; }
        .pcard-img { position: relative; display: block; overflow: hidden; }
        .pcard-img > div { transition: transform .5s cubic-bezier(0.22,1,0.36,1); }
        .pcard:hover .pcard-img > div { transform: scale(1.07); }
        .pcard-cat-float { position: absolute; top: 12px; left: 12px; z-index: 2;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(4px); box-shadow: var(--sombra); }
        .pcard-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
        .pcard-titulo { font-size: 1.08rem; margin-bottom: 6px; }
        .pcard-titulo a:hover { color: var(--azul-600); }
        .pcard-desc { color: var(--texto-suave); font-size: 0.9rem; flex: 1; margin-bottom: 14px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .pcard-precio { margin-bottom: 14px; }
        .pcard-acciones { display: flex; gap: 8px; }
      `}</style>
    </article>
  );
}
