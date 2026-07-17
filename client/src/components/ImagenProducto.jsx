import { urlImagen } from '../services/api.js';
import { IconSign, IconShield, IconVinyl, IconSparkle, IconBox } from './Icons.jsx';
import { PICTOGRAMAS } from './PictogramasSenal.jsx';

const ICONOS = {
  rotulos: IconSign,
  senalizacion: IconShield,
  viniles: IconVinyl,
  personalizados: IconSparkle,
};

// Muestra la imagen real del producto; si no hay, el pictograma propio del
// producto (señalización); si tampoco hay, un placeholder con gradiente
// azul corporativo + ícono de categoría (nunca se ve plano).
export default function ImagenProducto({ producto, alto = 200 }) {
  const src = urlImagen(producto.imagen);
  if (src) {
    return (
      <div style={{ height: alto, overflow: 'hidden', background: 'var(--gris-100)' }}>
        <img src={src} alt={producto.nombre}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  const pictograma = PICTOGRAMAS[producto.slug];
  if (pictograma) {
    const { Icono, bg, fg = '#fff' } = pictograma;
    return (
      <div style={{
        height: alto, display: 'grid', placeItems: 'center', position: 'relative',
        background: bg, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }} />
        <Icono size={Math.min(alto * 0.5, 130)} fg={fg} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 70, height: 70,
          background: 'rgba(255,255,255,0.15)', borderRadius: '50% 0 0 0',
        }} />
      </div>
    );
  }

  const Icono = ICONOS[producto.categoria_slug] || IconBox;
  return (
    <div style={{
      height: alto, display: 'grid', placeItems: 'center', position: 'relative',
      background: 'linear-gradient(135deg, var(--azul-900) 0%, var(--azul-700) 60%, var(--azul-600) 100%)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.12,
        backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
        backgroundSize: '22px 22px',
      }} />
      <Icono size={Math.min(alto * 0.32, 72)} style={{ color: 'rgba(255,255,255,0.92)' }} />
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: 90, height: 90,
        background: 'var(--rojo)', opacity: 0.18, borderRadius: '50% 0 0 0',
      }} />
    </div>
  );
}
