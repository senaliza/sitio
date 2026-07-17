// Íconos SVG elegantes — sin emojis. Reciben size y color por props.
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };

const Svg = ({ size = 24, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...rest}>{children}</svg>
);

export const IconSign = (p) => (
  <Svg {...p}><rect x="3" y="4" width="18" height="11" rx="2" /><path d="M12 15v5M8 20h8" /></Svg>
);
export const IconShield = (p) => (
  <Svg {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></Svg>
);
export const IconVinyl = (p) => (
  <Svg {...p}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></Svg>
);
export const IconSparkle = (p) => (
  <Svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" /></Svg>
);
export const IconCart = (p) => (
  <Svg {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h2.2l2.3 12.2a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.2L21 7H5" /></Svg>
);
export const IconWhatsApp = (p) => (
  <Svg {...p}><path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.4A9 9 0 1 1 21 12z" /><path d="M8.5 8.8c.2-.5.5-.5.8-.5h.6c.2 0 .5 0 .7.5.2.6.7 1.8.7 1.9.1.1.1.3 0 .4-.4.7-.8.8-.6 1.1.6.9 1.4 1.5 2.3 1.9.3.1.4 0 .6-.2.2-.3.5-.7.7-.9.2-.2.3-.1.6 0l1.7.8c.3.1.4.2.4.4 0 .5-.3 1.3-1.2 1.6-.9.3-2 .2-3.6-.6-1.7-.8-2.9-2.3-3.4-3.2-.5-.9-.5-1.6-.4-2.1z" /></Svg>
);
export const IconArrow = (p) => (
  <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>
);
export const IconSearch = (p) => (
  <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
);
export const IconTrash = (p) => (
  <Svg {...p}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></Svg>
);
export const IconPlus = (p) => (<Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>);
export const IconMinus = (p) => (<Svg {...p}><path d="M5 12h14" /></Svg>);
export const IconCheck = (p) => (<Svg {...p}><path d="M5 12l5 5 9-11" /></Svg>);
export const IconClose = (p) => (<Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>);
export const IconMenu = (p) => (<Svg {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>);
export const IconPhone = (p) => (
  <Svg {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Svg>
);
export const IconMail = (p) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></Svg>
);
export const IconPin = (p) => (
  <Svg {...p}><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>
);
export const IconUpload = (p) => (
  <Svg {...p}><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></Svg>
);
export const IconBox = (p) => (
  <Svg {...p}><path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" /></Svg>
);
export const IconClipboard = (p) => (
  <Svg {...p}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h6" /></Svg>
);
export const IconLayers = (p) => (
  <Svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" /></Svg>
);
export const IconStar = (p) => (
  <Svg {...p}><path d="M12 3l2.6 6.3 6.4.5-4.9 4.2 1.5 6.3L12 17l-5.6 3.3 1.5-6.3L3 9.8l6.4-.5L12 3z" /></Svg>
);
export const IconLogout = (p) => (
  <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Svg>
);
export const IconCard = (p) => (
  <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" /></Svg>
);
export const IconDownload = (p) => (
  <Svg {...p}><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></Svg>
);
export const IconPdf = (p) => (
  <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" /><path d="M14 3v5h5M9 13h1.2a1.3 1.3 0 0 1 0 2.6H9V13zm0 2.6V18M14 13v5M14 13h1.6M14 15.4h1.2" /></Svg>
);
