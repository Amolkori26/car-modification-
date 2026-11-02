import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeftRight,
  Sparkles,
  Zap,
  Gauge,
  Sliders,
  CheckCircle2,
  Layers,
  Flame,
  Info
} from 'lucide-react';
import { CarGraphic } from './CarGraphic';
import { VEHICLE_PRESETS, PAINT_OPTIONS } from '../data/mockData';

export const BeforeAfter: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]); // Nissan GT-R R35
  const [selectedCustomColor, setSelectedCustomColor] = useState(PAINT_OPTIONS[0]); // Acid Lime
  const [containerWidth, setContainerWidth] = useState(900);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize listener to ensure exact 1:1 pixel overlay between clipped layers
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(rect.width, x));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  // Car specific telemetry metrics
  const carSpecs = {
    'gtr-r35': {
      stockHp: '600 BHP',
      customHp: '885 BHP',
      stock0100: '2.8 Sec',
      custom0100: '2.1 Sec',
      stockAero: 'OEM Factory Splitter',
      customAero: 'Full Dry Carbon Widebody (+240kg)',
      stockWheels: 'Factory Cast 20" Alloys',
      customWheels: '20" Forged Split Monoblock (-16kg)',
      stockExhaust: 'Stainless Resonated (84 dB)',
      customExhaust: 'Burnt Titanium Valved (108 dB)',
      stockStance: 'OEM Factory (115mm Clear)',
      customStance: 'Track Monotube (-45mm Stance)',
    },
    'supra-mk5': {
      stockHp: '382 BHP',
      customHp: '640 BHP',
      stock0100: '3.9 Sec',
      custom0100: '2.9 Sec',
      stockAero: 'OEM Polypropylene Aero',
      customAero: 'Carbon Lip & Rear Wing (+180kg)',
      stockWheels: '19" Cast Alloys',
      customWheels: '19" Forged Deep Dish (-14kg)',
      stockExhaust: 'OEM Single Valve (82 dB)',
      customExhaust: 'Full Valved Screamer (106 dB)',
      stockStance: 'Factory Clearance (120mm)',
      customStance: 'Air-Ride Slammed (-70mm)',
    },
    'gt3-rs': {
      stockHp: '518 BHP',
      customHp: '585 BHP',
      stock0100: '3.0 Sec',
      custom0100: '2.5 Sec',
      stockAero: 'Factory Active Aero',
      customAero: 'Carbon Swan Neck + Canards (+320kg)',
      stockWheels: 'Forged Aluminum',
      customWheels: 'Magnesium Monoblock (-19kg)',
      stockExhaust: 'Factory Sport Exhaust',
      customExhaust: 'Inconel F1-Grade Valved',
      stockStance: 'Weissach Spec (-15mm)',
      customStance: 'Nürburgring Track Stance (-35mm)',
    },
    'm4-g82': {
      stockHp: '503 BHP',
      customHp: '720 BHP',
      stock0100: '3.4 Sec',
      custom0100: '2.6 Sec',
      stockAero: 'M Sport Factory Package',
      customAero: 'Dry Carbon Splitter + GT Wing',
      stockWheels: 'M Double Spoke 19/20"',
      customWheels: '20" Competition Mesh (-15kg)',
      stockExhaust: 'OEM Quad Tips (83 dB)',
      customExhaust: 'Titanium Downpipes & Tips',
      stockStance: 'Adaptive M Sport',
      customStance: 'Progressive Track Stance (-40mm)',
    },
  }[selectedVehicle.id] || {
    stockHp: '565 BHP',
    customHp: '885 BHP',
    stock0100: '2.9 Sec',
    custom0100: '2.1 Sec',
    stockAero: 'OEM Standard',
    customAero: 'Carbon Widebody Aero',
    stockWheels: 'Factory Cast Wheels',
    customWheels: 'Forged Monoblock',
    stockExhaust: 'OEM Stainless',
    customExhaust: 'Valved Titanium',
    stockStance: 'OEM Clearance',
    customStance: 'Track Lowered (-45mm)',
  };

  return (
    <section id="comparison" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Interactive Telemetry Comparison
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Stock OEM vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Vertex Custom</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mt-1">
            Compare the right side profile of one exact machine: factory assembly on the left versus full Vertex track transformation on the right.
          </p>
        </div>

        {/* Vehicle Model Selector for comparison */}
        <div className="flex flex-wrap items-center gap-2">
          {VEHICLE_PRESETS.map((car) => (
            <button
              key={car.id}
              onClick={() => setSelectedVehicle(car)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                selectedVehicle.id === car.id
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {car.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Split Slider Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border border-neutral-800 p-4 md:p-6 shadow-2xl overflow-hidden">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between mb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span className="text-neutral-300 font-bold uppercase tracking-wider">
              {selectedVehicle.name} • Right Side Profile Comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-neutral-500 hidden sm:inline">Custom Finish:</span>
            <div className="flex items-center gap-1.5">
              {PAINT_OPTIONS.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedCustomColor(p)}
                  title={p.name}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedCustomColor.id === p.id
                      ? 'border-white scale-125 ring-2 ring-lime-400/50'
                      : 'border-white/30 hover:scale-110'
                  }`}
                  style={{ backgroundColor: p.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The Split Screen Frame */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
          className="relative w-full h-[320px] md:h-[440px] rounded-2xl overflow-hidden cursor-ew-resize select-none bg-neutral-950 border border-neutral-800/80"
        >
          {/* LAYER 1: RIGHT SIDE / VERTEX CUSTOM SPEC (Full Base Canvas) */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="w-full max-w-4xl px-4">
              <CarGraphic
                paintHex={selectedCustomColor.hex}
                paintType={selectedCustomColor.type}
                rimId="forged-split-bronze"
                rimColor="#b45309"
                tintOpacity={0.78}
                tintColor="#020617"
                underglowColor={selectedCustomColor.hex}
                underglowPulse={true}
                aeroKit="Full Widebody Aero with GT Swan Neck Wing"
                stanceDropMm={45}
                isRevving={true}
                modelId={selectedVehicle.id}
              />
            </div>

            {/* Custom Spec Floating Badge */}
            <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-xl bg-lime-500/95 text-neutral-950 font-bold text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 shadow-[0_0_20px_rgba(132,204,22,0.4)]">
              <Sparkles className="w-3.5 h-3.5" />
              Vertex Custom Spec
            </div>
          </div>

          {/* LAYER 2: LEFT SIDE / STOCK OEM FACTORY SPEC (Clipped overlay) */}
          <div
            className="absolute inset-0 h-full overflow-hidden will-change-transform pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            {/* The inner container must match the exact container width so car graphics align 1:1 */}
            <div
              className="relative h-full flex items-center justify-center bg-neutral-950/90"
              style={{ width: `${containerWidth}px` }}
            >
              {/* Subtle factory showroom background grid for stock side */}
              <div className="absolute inset-0 bg-[radial-gradient(#38bdf808_1px,transparent_1px)] [background-size:24px_24px]" />

              <div className="w-full max-w-4xl px-4">
                <CarGraphic
                  paintHex="#94a3b8"
                  paintType="Gloss"
                  rimId="bbs-mesh-silver"
                  rimColor="#a1a1aa"
                  tintOpacity={0.12}
                  tintColor="#38bdf8"
                  underglowColor="transparent"
                  underglowPulse={false}
                  aeroKit="Stock OEM"
                  stanceDropMm={0}
                  isRevving={false}
                  modelId={selectedVehicle.id}
                />
              </div>

              {/* Stock Spec Floating Badge */}
              <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-xl bg-neutral-900/90 text-neutral-300 font-bold text-xs uppercase tracking-wider font-mono border border-neutral-700 shadow-lg">
                Stock OEM Spec
              </div>
            </div>
          </div>

          {/* DRAGGABLE DIVIDER HANDLE */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-white to-lime-400 z-20 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-neutral-950 border-2 border-cyan-400 flex items-center justify-center text-white shadow-[0_0_25px_rgba(6,182,212,0.6)] cursor-ew-resize">
              <ArrowLeftRight className="w-4 h-4 text-cyan-300 animate-pulse" />
            </div>

            {/* Top and Bottom Glow Anchors */}
            <div className="absolute -top-1 -translate-x-1/2 left-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <div className="absolute -bottom-1 -translate-x-1/2 left-1/2 w-3 h-3 rounded-full bg-lime-400 shadow-[0_0_10px_#a3e635]" />
          </div>

          {/* Bottom Floating Comparison Telemetry Labels */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-center pointer-events-none">
            <span className="text-[11px] font-mono text-neutral-300 bg-neutral-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-neutral-800">
              OEM Right Profile: Factory Silver • High Clearance • Quiet Cat
            </span>
            <span className="text-[11px] font-mono text-lime-400 bg-neutral-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-lime-500/40">
              Vertex Right Profile: {selectedCustomColor.name} • Widebody • Track Stance
            </span>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            {
              metric: 'Horsepower Output',
              stock: carSpecs.stockHp,
              custom: carSpecs.customHp,
              diff: `+${parseInt(carSpecs.customHp) - parseInt(carSpecs.stockHp)} BHP`,
            },
            {
              metric: '0-100 km/h Sprint',
              stock: carSpecs.stock0100,
              custom: carSpecs.custom0100,
              diff: '-0.8s Shaved',
            },
            {
              metric: 'Aerodynamics',
              stock: carSpecs.stockAero,
              custom: carSpecs.customAero,
              diff: '+Swan Neck Wing',
            },
            {
              metric: 'Wheelset Unsprung',
              stock: carSpecs.stockWheels,
              custom: carSpecs.customWheels,
              diff: '-16 kg Rotation',
            },
            {
              metric: 'Exhaust Tone',
              stock: carSpecs.stockExhaust,
              custom: carSpecs.customExhaust,
              diff: '108 dB Titanium',
            },
            {
              metric: 'Chassis Stance',
              stock: carSpecs.stockStance,
              custom: carSpecs.customStance,
              diff: '-45mm Monotube',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1 truncate">
                {item.metric}
              </span>
              <div className="text-xs text-neutral-400 line-through truncate">{item.stock}</div>
              <div className="text-sm font-bold text-white font-mono truncate">{item.custom}</div>
              <span className="text-[10px] font-mono text-lime-400 font-semibold block truncate mt-0.5">
                {item.diff}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
