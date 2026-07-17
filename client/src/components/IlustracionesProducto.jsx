// Ilustraciones SVG de marca para el carrusel (escenas por categoría).
// Son vectoriales propias (sin riesgo de copyright) y se pueden reemplazar
// por fotos reales pasando `img` en cada slide del carrusel.
// Paleta: colores reales del logo de Señaliza.

const VB = '0 0 600 460';
const slice = 'xMidYMid slice';

// Rótulos: fachada con rótulo iluminado.
export function IlustracionRotulos() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="372" width="600" height="88" fill="rgba(255,255,255,0.06)" />
      <rect x="120" y="168" width="360" height="208" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" />
      <rect x="150" y="112" width="300" height="74" rx="12" fill="#0A246E" stroke="#FEE40E" strokeWidth="3.5" />
      <text x="300" y="159" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="34" letterSpacing="2" fill="#fff">SEÑALIZA</text>
      <g stroke="#FEE40E" strokeWidth="3" strokeLinecap="round" opacity="0.85">
        <line x1="150" y1="100" x2="150" y2="86" /><line x1="300" y1="100" x2="300" y2="80" /><line x1="450" y1="100" x2="450" y2="86" />
      </g>
      <rect x="266" y="262" width="68" height="114" rx="5" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <rect x="160" y="216" width="78" height="60" rx="6" fill="#08A3EA" opacity="0.45" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      <rect x="362" y="216" width="78" height="60" rx="6" fill="#08A3EA" opacity="0.45" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
    </svg>
  );
}

// Señalización: poste con señal triangular de advertencia y señal circular.
export function IlustracionSenales() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="396" width="600" height="64" fill="rgba(255,255,255,0.06)" />
      <rect x="291" y="150" width="14" height="250" rx="5" fill="rgba(255,255,255,0.35)" />
      <polygon points="298,96 372,224 224,224" fill="#FEE40E" stroke="#0A246E" strokeWidth="6" strokeLinejoin="round" />
      <rect x="291" y="150" width="14" height="46" fill="#0A246E" rx="3" />
      <circle cx="298" cy="178" r="7" fill="#0A246E" />
      <circle cx="416" cy="300" r="52" fill="#F92832" stroke="#fff" strokeWidth="6" />
      <rect x="388" y="291" width="56" height="18" rx="4" fill="#fff" />
      <circle cx="182" cy="300" r="52" fill="#08A3EA" stroke="#fff" strokeWidth="6" />
      <path d="M182 276 v48 M162 300 h40" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

// Viniles: vehículo con rotulación / wrap en colores de marca.
export function IlustracionViniles() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="356" width="600" height="104" fill="rgba(255,255,255,0.06)" />
      <path d="M96 330 V232 q0-26 26-26 h150 l70 60 h118 q24 0 24 26 v38 q0 12 -12 12 H108 q-12 0 -12 -12 Z"
        fill="rgba(255,255,255,0.92)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
      <path d="M278 206 l60 52 h-150 v-26 q0-26 26-26 Z" fill="#08A3EA" opacity="0.5" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
      <rect x="118" y="250" width="150" height="20" rx="4" fill="#094C9F" />
      <rect x="118" y="276" width="120" height="12" rx="4" fill="#F92832" />
      <rect x="118" y="294" width="90" height="12" rx="4" fill="#60BB4D" />
      <circle cx="186" cy="356" r="34" fill="#0A246E" stroke="#fff" strokeWidth="6" />
      <circle cx="186" cy="356" r="13" fill="#fff" />
      <circle cx="404" cy="356" r="34" fill="#0A246E" stroke="#fff" strokeWidth="6" />
      <circle cx="404" cy="356" r="13" fill="#fff" />
    </svg>
  );
}

// Acrílicos: letra corpórea laser-cut sobre panel de acrílico con separadores.
export function IlustracionAcrilicos() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="378" width="600" height="82" fill="rgba(255,255,255,0.06)" />
      <rect x="70" y="70" width="460" height="300" rx="14" fill="rgba(255,255,255,0.05)" />
      <circle cx="150" cy="120" r="9" fill="rgba(255,255,255,0.55)" />
      <circle cx="450" cy="120" r="9" fill="rgba(255,255,255,0.55)" />
      <circle cx="150" cy="320" r="9" fill="rgba(255,255,255,0.55)" />
      <circle cx="450" cy="320" r="9" fill="rgba(255,255,255,0.55)" />
      <rect x="140" y="98" width="320" height="244" rx="14"
        fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
      <polygon points="160,112 224,112 168,326 122,326" fill="rgba(255,255,255,0.16)" />
      <text x="300" y="255" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800"
        fontSize="150" fill="#FEE40E" stroke="#0A246E" strokeWidth="3">A</text>
      <circle cx="200" cy="150" r="9" fill="#F92832" opacity="0.85" />
      <circle cx="400" cy="150" r="9" fill="#60BB4D" opacity="0.85" />
    </svg>
  );
}

// Publicidad: valla / billboard con afiche a color.
export function IlustracionPublicidad() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="404" width="600" height="56" fill="rgba(255,255,255,0.06)" />
      <rect x="150" y="280" width="16" height="124" fill="rgba(255,255,255,0.4)" />
      <rect x="434" y="280" width="16" height="124" fill="rgba(255,255,255,0.4)" />
      <rect x="120" y="96" width="360" height="196" rx="10" fill="#0A246E" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />
      <rect x="138" y="114" width="150" height="160" rx="6" fill="#08A3EA" opacity="0.85" />
      <circle cx="213" cy="160" r="30" fill="#FEE40E" />
      <rect x="156" y="210" width="116" height="14" rx="7" fill="#fff" opacity="0.9" />
      <rect x="156" y="234" width="84" height="12" rx="6" fill="#fff" opacity="0.6" />
      <rect x="304" y="126" width="160" height="30" rx="6" fill="#F92832" />
      <rect x="304" y="166" width="160" height="14" rx="7" fill="#fff" opacity="0.85" />
      <rect x="304" y="188" width="130" height="14" rx="7" fill="#fff" opacity="0.6" />
      <rect x="304" y="210" width="160" height="40" rx="8" fill="#60BB4D" />
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="3"><line x1="158" y1="292" x2="158" y2="404" /><line x1="442" y1="292" x2="442" y2="404" /></g>
    </svg>
  );
}

// ===== Variantes adicionales (segunda escena por categoría) =====

// Rótulos B: letras corpóreas 3D iluminadas ("open channel letters").
export function IlustracionRotulos2() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="360" width="600" height="100" fill="rgba(255,255,255,0.06)" />
      <g stroke="#FEE40E" strokeWidth="4" strokeLinecap="round" opacity="0.75">
        <line x1="150" y1="120" x2="150" y2="98" /><line x1="300" y1="120" x2="300" y2="92" /><line x1="450" y1="120" x2="450" y2="98" />
      </g>
      {/* Tres letras corpóreas con cara frontal y canto lateral (efecto 3D) */}
      <g>
        <rect x="112" y="150" width="90" height="150" rx="10" fill="#08A3EA" />
        <rect x="122" y="140" width="90" height="150" rx="10" fill="#fff" opacity="0.95" />
        <text x="167" y="252" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="120" fill="#094C9F">S</text>
      </g>
      <g>
        <rect x="248" y="150" width="104" height="150" rx="10" fill="#F92832" />
        <rect x="258" y="140" width="104" height="150" rx="10" fill="#fff" opacity="0.95" />
        <text x="310" y="252" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="120" fill="#094C9F">A</text>
      </g>
      <g>
        <rect x="398" y="150" width="90" height="150" rx="10" fill="#60BB4D" />
        <rect x="408" y="140" width="90" height="150" rx="10" fill="#fff" opacity="0.95" />
        <text x="453" y="252" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="120" fill="#094C9F">Ñ</text>
      </g>
    </svg>
  );
}

// Señalización B: señal de "Salida de emergencia" + extintor (seguridad ocupacional).
export function IlustracionSenales2() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="392" width="600" height="68" fill="rgba(255,255,255,0.06)" />
      {/* Señal verde salida de emergencia */}
      <rect x="120" y="150" width="220" height="120" rx="10" fill="#60BB4D" stroke="#fff" strokeWidth="5" />
      <g fill="#fff">
        <circle cx="168" cy="188" r="12" />
        <path d="M156 208 q12 -10 24 0 l14 30 -12 6 -10 -20 v40 h-16 v-58 Z" />
        <rect x="150" y="240" width="20" height="26" rx="4" transform="rotate(20 160 253)" />
      </g>
      <path d="M240 210 h60 M282 194 l24 16 -24 16" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Extintor */}
      <rect x="404" y="182" width="70" height="118" rx="18" fill="#F92832" stroke="#fff" strokeWidth="4" />
      <rect x="426" y="160" width="26" height="26" rx="5" fill="rgba(255,255,255,0.85)" />
      <rect x="418" y="150" width="52" height="12" rx="6" fill="#0A246E" />
      <path d="M470 168 q28 -6 30 22" stroke="#0A246E" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="418" y="220" width="42" height="34" rx="5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

// Adhesivos B: vitrina / escaparate con vinil de corte decorativo.
export function IlustracionViniles2() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="372" width="600" height="88" fill="rgba(255,255,255,0.06)" />
      {/* Marco de la vitrina */}
      <rect x="110" y="96" width="380" height="278" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      <line x1="300" y1="96" x2="300" y2="374" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      {/* Reflejo del vidrio */}
      <polygon points="150,110 230,110 150,300" fill="rgba(255,255,255,0.12)" />
      {/* Vinil de corte: círculo + texto + banda */}
      <circle cx="300" cy="180" r="52" fill="none" stroke="#F92832" strokeWidth="8" />
      <path d="M300 152 v56 M274 180 h52" stroke="#08A3EA" strokeWidth="8" strokeLinecap="round" />
      <rect x="176" y="266" width="248" height="18" rx="9" fill="#094C9F" />
      <rect x="210" y="296" width="180" height="14" rx="7" fill="#60BB4D" />
      <rect x="150" y="330" width="300" height="10" rx="5" fill="#FEE40E" opacity="0.9" />
    </svg>
  );
}

// Acrílicos B: directorio / placa de acrílico con separadores metálicos.
export function IlustracionAcrilicos2() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="378" width="600" height="82" fill="rgba(255,255,255,0.06)" />
      {/* Placa acrílica */}
      <rect x="170" y="96" width="260" height="288" rx="12" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
      {/* Reflejo */}
      <polygon points="190,110 240,110 190,320" fill="rgba(255,255,255,0.14)" />
      {/* Separadores metálicos en las esquinas */}
      <circle cx="196" cy="122" r="8" fill="#fff" opacity="0.85" />
      <circle cx="404" cy="122" r="8" fill="#fff" opacity="0.85" />
      <circle cx="196" cy="358" r="8" fill="#fff" opacity="0.85" />
      <circle cx="404" cy="358" r="8" fill="#fff" opacity="0.85" />
      {/* Renglones tipo directorio */}
      <rect x="200" y="150" width="200" height="16" rx="6" fill="#094C9F" />
      <rect x="200" y="188" width="150" height="12" rx="6" fill="#08A3EA" opacity="0.8" />
      <rect x="200" y="220" width="170" height="12" rx="6" fill="#F92832" opacity="0.75" />
      <rect x="200" y="252" width="130" height="12" rx="6" fill="#60BB4D" opacity="0.8" />
      <rect x="200" y="284" width="160" height="12" rx="6" fill="#08A3EA" opacity="0.6" />
      <rect x="200" y="316" width="110" height="12" rx="6" fill="#FEE40E" opacity="0.7" />
    </svg>
  );
}

// Publicidad B: banner roll-up de pie (como el stand de la marca).
export function IlustracionPublicidad2() {
  return (
    <svg viewBox={VB} preserveAspectRatio={slice} className="ilus">
      <rect x="0" y="392" width="600" height="68" fill="rgba(255,255,255,0.06)" />
      {/* Base del roll-up */}
      <rect x="222" y="384" width="156" height="18" rx="8" fill="rgba(255,255,255,0.5)" />
      <rect x="292" y="90" width="16" height="300" fill="rgba(255,255,255,0.4)" />
      {/* Lienzo del banner */}
      <rect x="200" y="86" width="200" height="290" rx="8" fill="#fff" opacity="0.96" />
      <rect x="200" y="86" width="200" height="96" rx="8" fill="#0A246E" />
      <text x="300" y="146" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="30" letterSpacing="1.5" fill="#fff">SEÑALIZA</text>
      <rect x="224" y="158" width="152" height="8" rx="4" fill="#08A3EA" />
      <circle cx="300" cy="238" r="34" fill="#08A3EA" opacity="0.85" />
      <path d="M300 216 v44 M278 238 h44" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <rect x="236" y="298" width="128" height="12" rx="6" fill="#094C9F" />
      <rect x="252" y="322" width="96" height="10" rx="5" fill="#F92832" opacity="0.8" />
      <rect x="228" y="348" width="144" height="14" rx="7" fill="#60BB4D" />
    </svg>
  );
}
