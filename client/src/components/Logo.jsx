import React, { useRef, useState, useLayoutEffect } from 'react';

// Recreated as clean vector SVG (transparent background, no raster).
// Exact brand colors from the original logo.
// Just the letters "SEÑALIZA" + the 5-color bar below.
// Animations on the bar are subtle and respect reduced-motion.

const LOGO_COLORS = ['#F92832', '#094C9F', '#08A3EA', '#60BB4D', '#FEE40E'];

export default function Logo({
  width = 148,
  height,
  className = '',
  title = 'Señaliza S.A.',
  textColor = '#094C9F',
  ...rest
}) {
  // viewBox tuned to closely match original proportions
  const vbW = 268;
  const vbH = 52;

  // Text metrics (tight tracking like the original mark)
  const textX = 7;
  const textY = 29.5;
  const fontSize = 26;

  // Color bar directly under the word, flush edges
  const barY = 35.5;
  const barH = 7.2;

  // The bar must span exactly the visible extent of the word, so the bar
  // starts where the first letter ("S") starts and the last color segment
  // ends where the last letter ("A") ends. We measure the real ink bounding
  // box of the text (it depends on the loaded font), with a sensible fallback.
  const textRef = useRef(null);
  const [bar, setBar] = useState({ x: textX, w: 254 });

  useLayoutEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      try {
        const b = el.getBBox();
        if (b.width > 0) setBar({ x: b.x, w: b.width });
      } catch { /* getBBox unsupported / not yet rendered */ }
    };
    measure();
    // Re-measure once the Sora web font is ready (first paint may use a
    // fallback font with a different width).
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
  }, [textColor]);

  const barX = bar.x;
  const barTotalW = bar.w;
  const segW = barTotalW / 5;

  return (
    <svg
      className={`logo-svg ${className}`}
      width={width}
      height={height ?? (width * vbH) / vbW}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio={height ? 'none' : 'xMidYMid meet'}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
      {...rest}
    >
      {/* Brand text — plain letters only (font renders the Ñ) */}
      <text
        ref={textRef}
        x={textX}
        y={textY}
        fontFamily="'Sora', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize={fontSize}
        fontWeight="800"
        letterSpacing="-1.15"
        fill={textColor}
      >
        SEÑALIZA
      </text>

      {/* 5-color bar — vector, perfectly sharp, no background */}
      <g className="logo-bar">
        {LOGO_COLORS.map((color, i) => (
          <rect
            key={i}
            className={`bar-seg seg-${i}`}
            x={barX + i * segW}
            y={barY}
            width={segW}
            height={barH}
            fill={color}
            rx="0.6"
            ry="0.6"
          />
        ))}
      </g>

      {/* Subtle interaction sweep layer (appears on hover) */}
      <g className="logo-sweep" opacity="0">
        <rect
          x={barX}
          y={barY - 0.6}
          width={barTotalW}
          height={barH + 1.2}
          fill="url(#logoSweepGrad)"
          className="sweep-rect"
        />
      </g>

      <defs>
        {/* Soft traveling highlight for the hover animation */}
        <linearGradient id="logoSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="62%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <style>{`
        .logo-svg {
          display: block;
          overflow: visible;
        }

        .logo-svg .bar-seg {
          transition: transform 160ms cubic-bezier(0.22,1,0.36,1), filter 160ms ease;
          transform-origin: center;
          will-change: transform, filter;
        }

        /* Hover sweep on the color bar - tasteful brand pulse */
        .logo-svg:hover .bar-seg {
          animation: none;
        }

        .logo-svg:hover .seg-0 { animation: barBright 920ms cubic-bezier(0.22,1,0.36,1) both; }
        .logo-svg:hover .seg-1 { animation: barBright 920ms 85ms cubic-bezier(0.22,1,0.36,1) both; }
        .logo-svg:hover .seg-2 { animation: barBright 920ms 170ms cubic-bezier(0.22,1,0.36,1) both; }
        .logo-svg:hover .seg-3 { animation: barBright 920ms 255ms cubic-bezier(0.22,1,0.36,1) both; }
        .logo-svg:hover .seg-4 { animation: barBright 920ms 340ms cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes barBright {
          0%   { filter: brightness(1) saturate(1); transform: scale(1); }
          18%  { filter: brightness(1.38) saturate(1.08); transform: scale(1.015); }
          42%  { filter: brightness(1.02) saturate(1); transform: scale(1); }
          100% { filter: brightness(1) saturate(1); transform: scale(1); }
        }

        /* Traveling sweep highlight (subtle white streak across the bar) */
        .logo-svg:hover .logo-sweep {
          opacity: 0.9;
          transition: opacity 80ms linear;
        }
        .logo-svg:hover .sweep-rect {
          animation: sweepMove 860ms cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes sweepMove {
          from { transform: translateX(-92%); }
          to   { transform: translateX(18%); }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .logo-svg .bar-seg,
          .logo-svg .sweep-rect {
            animation: none !important;
            transition: none !important;
          }
          .logo-svg:hover .logo-sweep { opacity: 0; }
        }

        /* When used inside .logo link, inherit hover lift from parent */
        .logo:hover .logo-svg {
          transform: translateY(-0.5px);
        }
      `}</style>
    </svg>
  );
}
