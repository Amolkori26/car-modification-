import React from 'react';

interface CarGraphicProps {
  paintHex: string;
  paintType: 'Gloss' | 'Matte' | 'Satin' | 'Metallic' | 'Chameleon' | 'Gloss Metallic';
  rimId: string;
  rimColor: string;
  tintOpacity: number;
  tintColor: string;
  underglowColor: string;
  underglowPulse: boolean;
  aeroKit: string;
  stanceDropMm: number;
  isRevving: boolean;
  modelId: string;
}

export const CarGraphic: React.FC<CarGraphicProps> = ({
  paintHex,
  paintType,
  rimId,
  rimColor,
  tintOpacity,
  tintColor,
  underglowColor,
  underglowPulse,
  aeroKit,
  stanceDropMm,
  isRevving,
  modelId,
}) => {
  // Stance drop maps to chassis Y shift (0mm = 0px, 70mm = 18px down)
  const chassisYOffset = Math.min(22, (stanceDropMm / 70) * 18);
  const hasWing = aeroKit.includes('Wing') || aeroKit.includes('Widebody');
  const hasSplitter = aeroKit.includes('Splitter') || aeroKit.includes('Widebody');
  const isWidebody = aeroKit.includes('Widebody');

  const showUnderglow = underglowColor && underglowColor !== 'transparent';

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none py-6">
      {/* SVG Canvas for Layered Precision Supercar */}
      <svg
        viewBox="0 0 1000 420"
        className="w-full h-auto drop-shadow-2xl overflow-visible transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Paint finishes & gradients */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={paintHex} stopOpacity="1" />
            <stop
              offset="50%"
              stopColor={
                paintType === 'Chameleon'
                  ? '#ec4899'
                  : paintType === 'Metallic'
                  ? '#ffffff'
                  : paintHex
              }
              stopOpacity={paintType === 'Metallic' ? 0.35 : paintType === 'Chameleon' ? 0.8 : 1}
            />
            <stop offset="100%" stopColor={paintHex} stopOpacity="0.82" />
          </linearGradient>

          <linearGradient id="bodySheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={paintType === 'Matte' ? 0.08 : 0.45} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity={paintType === 'Matte' ? 0.02 : 0.15} />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="carbonPattern" x1="0%" y1="0%" x2="10px" y2="10px" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#18181b" />
            <stop offset="50%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#09090b" />
          </linearGradient>

          {/* Underglow Filter */}
          <filter id="underglowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Flame Filter */}
          <filter id="flameGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. ASPHALT ROAD & GROUND REFLECTION */}
        <ellipse cx="500" cy="385" rx="460" ry="24" fill="#030712" opacity="0.8" />
        <ellipse cx="500" cy="385" rx="390" ry="14" fill="#000000" opacity="0.95" />

        {/* 2. NEON UNDERGLOW ILLUMINATION (Ground Bloom) */}
        {showUnderglow && (
          <g
            className={`transition-opacity duration-300 ${
              underglowPulse ? 'animate-pulse' : ''
            }`}
          >
            <ellipse
              cx="500"
              cy="382"
              rx="370"
              ry="22"
              fill={underglowColor}
              opacity="0.75"
              filter="url(#underglowBlur)"
            />
            <ellipse
              cx="500"
              cy="382"
              rx="290"
              ry="12"
              fill="#ffffff"
              opacity="0.35"
              filter="url(#underglowBlur)"
            />
          </g>
        )}

        {/* 3. EXHAUST FLAME BURSTS (Active when revving) */}
        {isRevving && (
          <g className="transition-all duration-100" filter="url(#flameGlow)">
            {/* Rear Exhaust Left Tip Flame */}
            <path
              d="M 120 338 Q 60 338 20 342 Q 65 348 118 344 Z"
              fill="#38bdf8"
              opacity="0.9"
            />
            <path
              d="M 115 339 Q 45 340 0 343 Q 50 346 115 343 Z"
              fill="#f59e0b"
              opacity="0.85"
            />
            <path
              d="M 110 340 Q 30 341 -20 343 Q 35 345 110 342 Z"
              fill="#ef4444"
              opacity="0.7"
            />
            {/* Spark particles */}
            <circle cx="35" cy="336" r="3" fill="#fef08a" />
            <circle cx="-10" cy="341" r="2.5" fill="#f97316" />
            <circle cx="70" cy="347" r="2" fill="#38bdf8" />
          </g>
        )}

        {/* 4. CHASSIS GROUP (Subject to Stance Lowering Offset) */}
        <g
          transform={`translate(0, ${chassisYOffset})`}
          className="transition-transform duration-300 ease-out"
        >
          {/* REAR GT SWAN NECK WING (If selected) */}
          {hasWing && (
            <g id="rearWing" className="transition-all duration-300">
              {/* Wing Uprights (Stands) */}
              <path
                d="M 175 220 L 160 140 L 175 140 L 190 220 Z"
                fill="#18181b"
                stroke="#27272a"
                strokeWidth="2"
              />
              <path
                d="M 205 220 L 195 140 L 210 140 L 220 220 Z"
                fill="#18181b"
                stroke="#27272a"
                strokeWidth="2"
              />
              {/* Swan Neck Top Mount curves */}
              <path
                d="M 160 140 Q 155 110 170 108 L 225 108 Q 235 110 230 140 Z"
                fill="#27272a"
              />
              {/* Main Carbon Blade Aerofoil */}
              <path
                d="M 110 115 L 260 108 L 262 120 L 115 128 Z"
                fill="#09090b"
                stroke="#3f3f46"
                strokeWidth="2"
              />
              {/* Endplates */}
              <polygon
                points="105,95 130,95 125,145 100,140"
                fill="#18181b"
                stroke={paintHex}
                strokeWidth="2"
              />
              <polygon
                points="255,90 275,90 270,135 250,130"
                fill="#18181b"
                stroke={paintHex}
                strokeWidth="2"
              />
            </g>
          )}

          {/* EXHAUST TIPS */}
          <rect x="110" y="334" width="28" height="12" rx="3" fill="#27272a" stroke="#71717a" />
          <ellipse cx="112" cy="340" rx="3" ry="5" fill="#38bdf8" opacity="0.6" />

          {/* CAR BODY BASE SILHOUETTE */}
          {/* Main Body Path (Aggressive Modern Exotic Sports Coupe) */}
          <path
            d="
              M 125 330
              L 125 285
              Q 130 250 165 240
              Q 215 225 295 220
              C 365 210, 420 150, 485 145
              L 655 145
              C 735 150, 785 210, 835 240
              Q 895 260, 915 295
              L 920 335
              L 890 345
              Q 880 348 830 348
              Q 790 348 760 348
              L 640 348
              L 370 348
              L 260 348
              Q 210 348 180 345
              Z
            "
            fill="url(#bodyGradient)"
            stroke="#09090b"
            strokeWidth="3"
          />

          {/* Body Sheen & Gloss Highlights */}
          <path
            d="
              M 130 285
              Q 215 230 295 224
              C 365 212, 420 152, 485 147
              L 655 147
              C 735 152, 785 212, 835 242
              Q 895 262, 915 295
              L 910 305
              Q 885 275, 830 250
              C 780 220, 730 165, 650 160
              L 490 160
              C 430 165, 375 225, 300 235
              Q 220 245 135 295
              Z
            "
            fill="url(#bodySheen)"
          />

          {/* WIDEBODY FENDER FLARES (If Widebody active) */}
          {isWidebody && (
            <g id="widebodyFlares">
              {/* Front Flare */}
              <path
                d="M 680 345 Q 675 255 770 250 Q 865 255 860 345 Q 840 270 770 270 Q 700 270 680 345 Z"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="2"
                opacity="0.95"
              />
              {/* Bolt Rivets Front */}
              {[690, 715, 745, 775, 805, 835, 855].map((bx, i) => (
                <circle key={`bf-${i}`} cx={bx} cy={275 + Math.sin(i * 0.5) * 8} r="2" fill="#71717a" />
              ))}

              {/* Rear Flare */}
              <path
                d="M 180 345 Q 175 240 270 235 Q 365 240 360 345 Q 340 255 270 255 Q 200 255 180 345 Z"
                fill="#18181b"
                stroke="#3f3f46"
                strokeWidth="2"
                opacity="0.95"
              />
              {/* Bolt Rivets Rear */}
              {[190, 215, 245, 275, 305, 335, 355].map((bx, i) => (
                <circle key={`br-${i}`} cx={bx} cy={260 + Math.sin(i * 0.5) * 8} r="2" fill="#71717a" />
              ))}
            </g>
          )}

          {/* GREENHOUSE / CABIN & WINDOW GLASS (With Tint) */}
          <path
            d="
              M 370 215
              C 420 160, 460 152, 495 152
              L 645 152
              C 695 155, 735 185, 765 220
              L 650 220
              L 490 220
              Z
            "
            fill={tintColor}
            fillOpacity={tintOpacity}
            stroke="#18181b"
            strokeWidth="3"
          />

          {/* Window Pillar (B-Pillar) */}
          <polygon
            points="540,152 555,152 548,220 533,220"
            fill="#09090b"
            stroke="#18181b"
          />

          {/* Window Glass Reflection Highlight */}
          <path
            d="M 430 205 L 485 158 L 520 158 L 470 215 Z"
            fill="#ffffff"
            opacity="0.25"
          />
          <path
            d="M 660 158 L 730 215 L 710 215 L 648 158 Z"
            fill="#ffffff"
            opacity="0.18"
          />

          {/* DOOR CUTOUT & CHARACTER BODY LINES */}
          <path
            d="M 370 220 L 360 345"
            stroke="#09090b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 545 220 L 535 345"
            stroke="#09090b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 390 250 L 640 250"
            stroke="#09090b"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* DOOR HANDLE */}
          <rect x="420" y="235" width="22" height="5" rx="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />

          {/* HEADLIGHTS (Cyber LED Matrix with Projector DRLs) */}
          <polygon
            points="850,250 910,290 890,298 840,265"
            fill="#e0f2fe"
            stroke="#0284c7"
            strokeWidth="2"
          />
          <line x1="855" y1="255" x2="898" y2="292" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="880" cy="280" r="4" fill="#ffffff" />

          {/* TAILLIGHTS (High-Tech LED Blade Neon Strip) */}
          <path
            d="M 125 270 Q 155 268 185 275 L 180 282 Q 155 275 125 280 Z"
            fill="#ef4444"
            filter="drop-shadow(0 0 6px #ef4444)"
          />

          {/* FRONT AIR INTAKE & GRILLE */}
          <polygon
            points="880,310 920,315 915,342 865,342"
            fill="#09090b"
            stroke="#27272a"
          />
          <line x1="875" y1="325" x2="915" y2="328" stroke="#18181b" strokeWidth="2" />

          {/* FRONT CARBON SPLITTER & CANARDS (If selected) */}
          {hasSplitter && (
            <g id="frontSplitter">
              {/* Bottom Ground-Scraping Blade */}
              <polygon
                points="840,352 940,352 935,344 850,344"
                fill="#09090b"
                stroke="#52525b"
                strokeWidth="1.5"
              />
              {/* Dive Plane / Canard */}
              <polygon
                points="895,300 930,310 925,315 890,305"
                fill="#18181b"
                stroke="#52525b"
                strokeWidth="1"
              />
            </g>
          )}

          {/* SIDE SKIRT EXTENSION (Carbon Aerodynamic Blade) */}
          <rect
            x="365"
            y="346"
            width="280"
            height="7"
            rx="2"
            fill="#09090b"
            stroke="#3f3f46"
            strokeWidth="1.5"
          />

          {/* REAR DIFFUSER FINS */}
          <polygon points="125,340 160,340 155,350 120,350" fill="#09090b" stroke="#3f3f46" />
          <line x1="135" y1="340" x2="135" y2="350" stroke="#71717a" strokeWidth="2" />
          <line x1="148" y1="340" x2="148" y2="350" stroke="#71717a" strokeWidth="2" />

          {/* WHEEL ARCH WELLS (Cutouts for tires) */}
          {/* Rear Wheel Well Inner Shadow */}
          <circle cx="270" cy="340" r="62" fill="#09090b" />
          {/* Front Wheel Well Inner Shadow */}
          <circle cx="770" cy="340" r="62" fill="#09090b" />
        </g>

        {/* 5. WHEELS & TIRES ASSEMBLY (Fixed ground axis relative to road) */}
        {/* REAR WHEEL */}
        <g id="rearWheelGroup" transform="translate(270, 340)">
          {/* Tire Rubber */}
          <circle cx="0" cy="0" r="54" fill="#18181b" stroke="#09090b" strokeWidth="4" />
          <circle cx="0" cy="0" r="51" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="6 3" />
          {/* Rim Outer Lip */}
          <circle cx="0" cy="0" r="42" fill="#18181b" stroke={rimColor} strokeWidth="3" />
          {/* Brake Rotor & Caliper */}
          <circle cx="0" cy="0" r="32" fill="#3f3f46" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          {/* Big Brake Caliper (Neon lime / red) */}
          <path d="M 14 -26 A 30 30 0 0 1 28 -8 L 22 -6 A 24 24 0 0 0 10 -22 Z" fill="#84cc16" stroke="#65a30d" />

          {/* RIMS SPOKES (Rendered according to style) */}
          {rimId === 'forged-split-bronze' && (
            <g stroke={rimColor} strokeWidth="4" strokeLinecap="round">
              {[0, 72, 144, 216, 288].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <line x1="0" y1="0" x2="-6" y2="-38" />
                  <line x1="0" y1="0" x2="6" y2="-38" />
                </g>
              ))}
            </g>
          )}

          {rimId === 'deep-dish-black' && (
            <g>
              <circle cx="0" cy="0" r="34" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-38"
                  stroke={rimColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}

          {rimId === 'bbs-mesh-silver' && (
            <g stroke={rimColor} strokeWidth="2">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line key={deg} x1="0" y1="0" x2="0" y2="-38" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="22" fill="none" stroke={rimColor} strokeWidth="2" />
            </g>
          )}

          {rimId === 'aero-carbon' && (
            <g>
              <circle cx="0" cy="0" r="39" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <polygon
                  key={deg}
                  points="-4,-10 4,-10 12,-38 -12,-38"
                  fill="#09090b"
                  stroke={rimColor}
                  strokeWidth="1"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}

          {/* Center Hub */}
          <circle cx="0" cy="0" r="9" fill="#09090b" stroke={rimColor} strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#ef4444" />
        </g>

        {/* FRONT WHEEL */}
        <g id="frontWheelGroup" transform="translate(770, 340)">
          {/* Tire Rubber */}
          <circle cx="0" cy="0" r="54" fill="#18181b" stroke="#09090b" strokeWidth="4" />
          <circle cx="0" cy="0" r="51" fill="none" stroke="#27272a" strokeWidth="2" strokeDasharray="6 3" />
          {/* Rim Outer Lip */}
          <circle cx="0" cy="0" r="42" fill="#18181b" stroke={rimColor} strokeWidth="3" />
          {/* Brake Rotor & Caliper */}
          <circle cx="0" cy="0" r="32" fill="#3f3f46" stroke="#71717a" strokeWidth="1" strokeDasharray="3 3" />
          {/* Big Brake Caliper */}
          <path d="M 14 -26 A 30 30 0 0 1 28 -8 L 22 -6 A 24 24 0 0 0 10 -22 Z" fill="#84cc16" stroke="#65a30d" />

          {/* RIMS SPOKES */}
          {rimId === 'forged-split-bronze' && (
            <g stroke={rimColor} strokeWidth="4" strokeLinecap="round">
              {[0, 72, 144, 216, 288].map((deg) => (
                <g key={deg} transform={`rotate(${deg})`}>
                  <line x1="0" y1="0" x2="-6" y2="-38" />
                  <line x1="0" y1="0" x2="6" y2="-38" />
                </g>
              ))}
            </g>
          )}

          {rimId === 'deep-dish-black' && (
            <g>
              <circle cx="0" cy="0" r="34" fill="#09090b" stroke="#3f3f46" strokeWidth="2" />
              {[0, 72, 144, 216, 288].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-38"
                  stroke={rimColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}

          {rimId === 'bbs-mesh-silver' && (
            <g stroke={rimColor} strokeWidth="2">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line key={deg} x1="0" y1="0" x2="0" y2="-38" transform={`rotate(${deg})`} />
              ))}
              <circle cx="0" cy="0" r="22" fill="none" stroke={rimColor} strokeWidth="2" />
            </g>
          )}

          {rimId === 'aero-carbon' && (
            <g>
              <circle cx="0" cy="0" r="39" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <polygon
                  key={deg}
                  points="-4,-10 4,-10 12,-38 -12,-38"
                  fill="#09090b"
                  stroke={rimColor}
                  strokeWidth="1"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}

          {/* Center Hub */}
          <circle cx="0" cy="0" r="9" fill="#09090b" stroke={rimColor} strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#ef4444" />
        </g>
      </svg>
    </div>
  );
};
