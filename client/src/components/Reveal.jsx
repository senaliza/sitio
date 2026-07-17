import { useEffect, useRef, useState } from "react";
/**
 * Revela su contenido con una animación sutil al entrar en viewport.
 * Sin dependencias — usa IntersectionObserver nativo.
 *
 * props:
 *  - as: etiqueta/elemento contenedor (por defecto 'div')
 *  - delay: retardo en ms para escalonar (stagger)
 *  - y: desplazamiento inicial en px (por defecto 24)
 *  - once: si true (por defecto) solo anima la primera vez
 */
export default function Reveal({
  as: Tag = "div",
  children,
  delay = 0,
  y = 24,
  once = true,
  className = "",
  style = {},
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respeta la preferencia de movimiento reducido.
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{
        "--reveal-delay": `${delay}ms`,
        "--reveal-y": `${y}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
