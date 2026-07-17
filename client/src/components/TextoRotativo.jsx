import { useEffect, useState } from 'react';

/**
 * Muestra una palabra a la vez de `palabras`, rotando con una transición suave.
 * Sin dependencias. Respeta prefers-reduced-motion (queda fija en la primera).
 */
export default function TextoRotativo({ palabras = [], intervalo = 2400, className = '' }) {
  const [i, setI] = useState(0);
  const [dentro, setDentro] = useState(true);

  useEffect(() => {
    if (palabras.length <= 1) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setDentro(false);
      const t = setTimeout(() => {
        setI((v) => (v + 1) % palabras.length);
        setDentro(true);
      }, 260);
      return () => clearTimeout(t);
    }, intervalo);
    return () => clearInterval(id);
  }, [palabras, intervalo]);

  return (
    <span className={`texto-rot ${dentro ? 'in' : 'out'} ${className}`.trim()}>
      {palabras[i] || ''}
    </span>
  );
}
