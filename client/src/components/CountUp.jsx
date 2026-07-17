import { useEffect, useRef, useState } from 'react';

/**
 * Número que cuenta de 0 hasta `fin` cuando entra en viewport.
 * Sin dependencias — IntersectionObserver + requestAnimationFrame.
 *
 * props:
 *  - fin: número objetivo
 *  - duracion: ms de la animación (por defecto 1800)
 *  - prefijo / sufijo: texto antes/después (ej. '+', '%')
 *  - decimales: cantidad de decimales a mostrar
 */
export default function CountUp({
  fin = 0,
  duracion = 1800,
  prefijo = '',
  sufijo = '',
  decimales = 0,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const lanzado = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(fin);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !lanzado.current) {
          lanzado.current = true;
          const t0 = performance.now();
          const tick = (now) => {
            const p = Math.min((now - t0) / duracion, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setVal(fin * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(fin);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fin, duracion]);

  const mostrado = decimales > 0
    ? val.toFixed(decimales)
    : Math.round(val).toLocaleString('es-CR');

  return <span ref={ref} className={className} {...rest}>{prefijo}{mostrado}{sufijo}</span>;
}
