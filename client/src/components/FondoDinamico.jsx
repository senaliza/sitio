import { useMemo } from 'react';

// Fondo "wave field" de marca: líneas de onda que fluyen horizontalmente con
// los colores del logo de Señaliza. Fijo al viewport y detrás de todo el
// contenido, presente en todo el sitio. Respeta prefers-reduced-motion.

const VB_W = 1440;
const VB_H = 900;

// Colores REALES tomados pixel a pixel de la barra del logo de Señaliza.
// El azul domina el campo (identidad de marca); rojo, verde y amarillo
// entran como acentos para no perder el azul al ganar transparencia.
const LOGO = {
  rojo: '#F92832',
  azul: '#094C9F',
  cian: '#08A3EA',
  verde: '#60BB4D',
  amarillo: '#FEE40E',
};
const ONDAS = [
  { y: 120, amp: 58, wl: 520, color: LOGO.cian,     op: 0.58, dur: 26 },
  { y: 235, amp: 46, wl: 430, color: LOGO.azul,     op: 0.60, dur: 33 },
  { y: 360, amp: 70, wl: 640, color: LOGO.verde,    op: 0.34, dur: 39 },
  { y: 480, amp: 52, wl: 480, color: LOGO.cian,     op: 0.52, dur: 30 },
  { y: 600, amp: 64, wl: 560, color: LOGO.amarillo, op: 0.32, dur: 35 },
  { y: 715, amp: 44, wl: 400, color: LOGO.azul,     op: 0.56, dur: 28 },
  { y: 825, amp: 60, wl: 600, color: LOGO.rojo,     op: 0.30, dur: 37 },
];

// Genera un trazo de onda senoidal. Se dibuja con un período extra a cada lado
// para que, al desplazarlo exactamente una longitud de onda, el bucle sea
// imperceptible (continuo).
function pathOnda(baseY, amp, wl) {
  const xStart = -wl;
  const xEnd = VB_W * 2 + wl;
  const step = wl / 18;
  let d = '';
  for (let x = xStart; x <= xEnd; x += step) {
    const y = baseY + amp * Math.sin((2 * Math.PI * x) / wl);
    d += (d ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
}

export default function FondoDinamico() {
  const ondas = useMemo(
    () => ONDAS.map((o) => ({ ...o, d: pathOnda(o.y, o.amp, o.wl) })),
    [],
  );

  return (
    <div className="fondo-wave" aria-hidden>
      <svg
        className="wf-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {ondas.map((o, i) => (
          <g
            key={i}
            className="wf-g"
            style={{ '--wl': o.wl, animationDuration: `${o.dur}s`, animationDelay: `${-o.dur / 2}s` }}
          >
            <path
              d={o.d}
              fill="none"
              stroke={o.color}
              strokeWidth="3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: o.op }}
            />
          </g>
        ))}
      </svg>

      <style>{`
        .fondo-wave {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(170deg, #f2f7ff 0%, #e4edfb 55%, #d7e4f7 100%);
        }
        .wf-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
        .wf-g { will-change: transform; animation-name: wf-flow; animation-timing-function: linear; animation-iteration-count: infinite; }
        @keyframes wf-flow {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(var(--wl) * -1px)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wf-g { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
