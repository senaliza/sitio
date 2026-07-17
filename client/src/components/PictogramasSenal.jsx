// Pictogramas SVG propios por producto de señalización (sin stock photos,
// mismo criterio que IlustracionesProducto.jsx). Colores siguiendo la
// convención real de rotulación de seguridad: verde = zona segura/evacuación,
// rojo = equipo contra incendios, amarillo+negro = advertencia,
// azul = obligatorio/informativo, tonos propios para cada tipo de residuo.

const IconoSalida = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
    stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    {/* marco de puerta */}
    <path d="M10 16 H30 M10 16 V84 M10 84 H30" />
    {/* figura corriendo (líneas limpias) */}
    <circle cx="58" cy="22" r="7" fill="#fff" stroke="none" />
    <path d="M56 30 L48 52" />
    <path d="M48 52 L62 60 L60 80" />
    <path d="M48 52 L36 58 L30 78" />
    <path d="M53 36 L67 42" />
    <path d="M54 36 L44 30" />
    {/* flecha de salida */}
    <path d="M76 22 H94 M86 15 L95 22 L86 29" />
  </svg>
);

const IconoRutaEvac = ({ size = 60, flip = false }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
    stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
    style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    {/* figura corriendo (líneas limpias) */}
    <circle cx="26" cy="22" r="7" fill="#fff" stroke="none" />
    <path d="M24 30 L16 52" />
    <path d="M16 52 L30 60 L28 78" />
    <path d="M16 52 L8 58 L6 74" />
    <path d="M22 36 L36 42" />
    <path d="M23 36 L14 30" />
    {/* flecha direccional */}
    <path d="M50 50 H92 M81 39 L96 50 L81 61" />
  </svg>
);

const IconoFlecha = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path d="M10 50 H70 M50 25 L78 50 L50 75" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconoExtintor = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <rect x="38" y="35" width="26" height="50" rx="10" />
    <rect x="44" y="20" width="14" height="18" rx="3" />
    <rect x="40" y="14" width="22" height="8" rx="3" />
    <path d="M62 24 L82 14 L86 22 L66 32 Z" />
    <rect x="30" y="46" width="10" height="6" rx="2" />
    <path d="M30 49 Q18 55 20 70" stroke={fg} strokeWidth="4" fill="none" strokeLinecap="round" />
  </svg>
);

const IconoAlarma = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <path d="M50 15c-14 0-22 11-22 26v14l-8 14h60l-8-14V41c0-15-8-26-22-26z" />
    <rect x="44" y="10" width="12" height="10" rx="4" />
    <path d="M40 74a10 10 0 0 0 20 0z" />
  </svg>
);

const IconoBotiquin = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="14" y="30" width="72" height="54" rx="10" stroke={fg} strokeWidth="7" />
    <rect x="42" y="44" width="16" height="26" fill={fg} />
    <rect x="32" y="54" width="36" height="16" fill={fg} />
  </svg>
);

const IconoCruz = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <rect x="40" y="18" width="20" height="64" rx="4" />
    <rect x="18" y="40" width="64" height="20" rx="4" />
  </svg>
);

const IconoRayo = ({ size = 60, fg = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <path d="M55 10 L25 55 H45 L38 90 L78 40 H55 Z" />
  </svg>
);

const IconoEngranajes = ({ size = 60, fg = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={fg} strokeWidth="7">
    <circle cx="36" cy="60" r="18" />
    <circle cx="66" cy="34" r="13" />
  </svg>
);

const IconoLlama = ({ size = 60, fg = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <path d="M50 10c10 16-6 20-6 34 0 8 6 12 6 12s6-4 6-12c0-6-4-10-2-16 8 6 14 18 14 30 0 16-13 28-28 28S12 74 12 58c0-18 14-30 22-42 4 8 2 14 6 16-2-8 4-16 10-22z" />
  </svg>
);

const IconoProhibido = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <rect x="18" y="46" width="52" height="12" rx="2" fill={fg} />
    <circle cx="50" cy="50" r="38" stroke={fg} strokeWidth="7" fill="none" />
    <line x1="22" y1="78" x2="78" y2="22" stroke={fg} strokeWidth="7" strokeLinecap="round" />
  </svg>
);

const IconoInfo = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <circle cx="50" cy="50" r="38" fill="none" stroke={fg} strokeWidth="7" />
    <rect x="44" y="42" width="12" height="30" rx="4" />
    <circle cx="50" cy="28" r="7" />
  </svg>
);

const IconoGas = ({ size = 60, fg = '#111' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <rect x="42" y="10" width="16" height="12" rx="3" />
    <path d="M35 20h30l6 14v40a12 12 0 0 1-12 12H41a12 12 0 0 1-12-12V34z" />
  </svg>
);

const IconoHombre = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <circle cx="50" cy="24" r="12" />
    <path d="M32 90 V58 a18 18 0 0 1 36 0 V90 Z" />
  </svg>
);

const IconoMujer = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <circle cx="50" cy="22" r="12" />
    <path d="M50 38 L30 78 H70 Z" />
    <rect x="42" y="72" width="16" height="18" />
  </svg>
);

const IconoMixto = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <circle cx="30" cy="22" r="10" />
    <path d="M15 88 V60 a15 15 0 0 1 30 0 V88 Z" />
    <circle cx="70" cy="20" r="10" />
    <path d="M70 34 L54 82 H86 Z" />
  </svg>
);

const IconoMixto7600 = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="22" cy="18" r="8" fill={fg} />
    <path d="M14 46 V32 a8 8 0 0 1 16 0 V46 Z" fill={fg} />
    <circle cx="50" cy="16" r="8" fill={fg} />
    <path d="M50 26 L38 52 H62 Z" fill={fg} />
    <circle cx="76" cy="66" r="20" stroke={fg} strokeWidth="6" fill="none" />
    <circle cx="76" cy="66" r="4" fill={fg} />
    <path d="M76 66 L76 46 M76 66 L92 66" stroke={fg} strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const IconoSillaRuedas = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="55" cy="22" r="9" fill={fg} />
    <path d="M55 34 L50 55 H72" stroke={fg} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 55 L38 78" stroke={fg} strokeWidth="7" fill="none" strokeLinecap="round" />
    <circle cx="38" cy="78" r="16" stroke={fg} strokeWidth="6" fill="none" />
    <path d="M50 55 H30" stroke={fg} strokeWidth="6" strokeLinecap="round" />
  </svg>
);

const IconoBasura = ({ size = 60, fg = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fg}>
    <rect x="30" y="34" width="40" height="50" rx="4" />
    <rect x="24" y="24" width="52" height="10" rx="3" />
    <rect x="42" y="14" width="16" height="10" rx="2" />
  </svg>
);

const IconoPuntoReunion = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
    stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    {/* persona izquierda */}
    <circle cx="26" cy="42" r="6" fill="#fff" stroke="none" />
    <path d="M26 48 L26 68" />
    <path d="M26 68 L20 82 M26 68 L32 82" />
    <path d="M26 54 L18 62 M26 54 L34 62" />
    {/* persona derecha */}
    <circle cx="74" cy="42" r="6" fill="#fff" stroke="none" />
    <path d="M74 48 L74 68" />
    <path d="M74 68 L68 82 M74 68 L80 82" />
    <path d="M74 54 L66 62 M74 54 L82 62" />
    {/* persona centro */}
    <circle cx="50" cy="30" r="7" fill="#fff" stroke="none" />
    <path d="M50 37 L50 60" />
    <path d="M50 60 L43 76 M50 60 L57 76" />
    <path d="M50 44 L40 52 M50 44 L60 52" />
  </svg>
);

const VERDE = '#0a7d34';
const ROJO = '#d32f2f';
const AMARILLO = '#f5b301';
const AZUL = '#0060a9';

// slug (tal como los genera database/productos-seed.sql) -> pictograma + colores
export const PICTOGRAMAS = {
  'salida-10x33cm':                    { Icono: IconoSalida,       bg: VERDE },
  'salida-20x66cm':                    { Icono: IconoSalida,       bg: VERDE },
  'salida-emergencia-175x56cm':        { Icono: IconoSalida,       bg: VERDE },
  'ruta-evacuacion-derecha-175x35cm':  { Icono: (p) => <IconoRutaEvac {...p} />,             bg: VERDE },
  'ruta-evacuacion-izquierda-175x35cm':{ Icono: (p) => <IconoRutaEvac {...p} flip />,         bg: VERDE },
  'flecha-175x175cm':                  { Icono: IconoFlecha,       bg: VERDE },
  'extintor-foto-174x224cm':           { Icono: IconoExtintor,     bg: ROJO },
  'extintor-foto-224x274cm':           { Icono: IconoExtintor,     bg: ROJO },
  'alarma-foto-174x224cm':             { Icono: IconoAlarma,       bg: ROJO },
  'botiquin-foto-224x274cm':           { Icono: IconoBotiquin,     bg: VERDE },
  'primeros-auxilios-foto-224x274cm':  { Icono: IconoCruz,         bg: VERDE },

  'tipo-extintor-20x30cm':             { Icono: IconoExtintor,     bg: ROJO },
  'tipo-extintor-30x40cm':             { Icono: IconoExtintor,     bg: ROJO },
  'riesgo-electrico-124x174cm':        { Icono: IconoRayo,         bg: AMARILLO, fg: '#111' },
  'riesgo-atrapamiento-124x174cm':     { Icono: IconoEngranajes,   bg: AMARILLO, fg: '#111' },
  'riesgo-incendio-124x174cm':         { Icono: IconoLlama,        bg: AMARILLO, fg: '#111' },
  'peligro-alto-voltaje-20x30cm':      { Icono: IconoRayo,         bg: AMARILLO, fg: '#111' },
  'ley-vapeo-fumado-sanitarios-20x15cm':     { Icono: IconoProhibido, bg: ROJO },
  'ley-vapeo-fumado-comunes-30x40cm':        { Icono: IconoProhibido, bg: ROJO },
  'ley-vapeo-fumado-parqueo-3mm-60x90cm':    { Icono: IconoProhibido, bg: ROJO },
  'ley-acoso-20x30cm':                 { Icono: IconoInfo,         bg: AZUL },
  'lpg-30x40cm':                       { Icono: IconoGas,          bg: AMARILLO, fg: '#111' },
  'sanitarios-hombres-20x15cm':        { Icono: IconoHombre,       bg: AZUL },
  'sanitarios-mujeres-20x15cm':        { Icono: IconoMujer,        bg: AZUL },
  'sanitarios-mixto-25x15cm':          { Icono: IconoMixto,        bg: AZUL },
  'sanitarios-mixto-ley7600-30x15cm':  { Icono: IconoMixto7600,    bg: AZUL },
  'simbolo-ley7600-15x15cm':           { Icono: IconoSillaRuedas,  bg: AZUL },
  'residuos-organicos-20x30cm':        { Icono: IconoBasura,       bg: '#65a30d' },
  'residuos-plasticos-20x30cm':        { Icono: IconoBasura,       bg: '#eab308', fg: '#111' },
  'residuos-vidrio-20x30cm':           { Icono: IconoBasura,       bg: '#0d9488' },
  'residuos-ordinarios-20x30cm':       { Icono: IconoBasura,       bg: '#64748b' },
  'residuos-papel-carton-20x30cm':     { Icono: IconoBasura,       bg: '#2563eb' },
  'residuos-metal-aluminio-20x30cm':   { Icono: IconoBasura,       bg: '#94a3b8', fg: '#111' },

  'ley-vapeo-fumado-parqueo-5mm-60x90cm': { Icono: IconoProhibido, bg: ROJO },
  'punto-reunion-45x65cm':             { Icono: IconoPuntoReunion, bg: VERDE },
};
