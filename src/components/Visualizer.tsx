import React, { useState } from 'react';
import {
  CarGraphic
} from './CarGraphic';
import { EngineRevModule } from './EngineRevModule';
import {
  VEHICLE_PRESETS,
  PAINT_OPTIONS,
  RIM_OPTIONS,
  TINT_OPTIONS,
  UNDERGLOW_OPTIONS,
  TUNING_OPTIONS,
  AERO_OPTIONS,
  STANCE_OPTIONS,
} from '../data/mockData';
import { BookingConfig } from '../types';
import {
  Sparkles,
  Zap,
  Gauge,
  Sliders,
  DollarSign,
  Palette,
  Disc,
  Layers,
  Wind,
  ShieldCheck,
  Send,
  RotateCcw,
  Check
} from 'lucide-react';

interface VisualizerProps {
  onSelectForBooking: (config: BookingConfig, vehicleName: string, calculatedPrice: number) => void;
  onOpenGalleryPublish?: (config: BookingConfig, vehicleName: string) => void;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  onSelectForBooking,
  onOpenGalleryPublish,
}) => {
  // Active Selected Vehicle Preset
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLE_PRESETS[0]);

  // Visualizer Config States
  const [selectedPaint, setSelectedPaint] = useState(PAINT_OPTIONS[0]); // Acid Lime
  const [selectedRim, setSelectedRim] = useState(RIM_OPTIONS[0]);
  const [selectedTint, setSelectedTint] = useState(TINT_OPTIONS[2]); // 15% Dark
  const [selectedUnderglow, setSelectedUnderglow] = useState(UNDERGLOW_OPTIONS[1]); // Lime
  const [underglowPulse, setUnderglowPulse] = useState(true);
  const [selectedTuning, setSelectedTuning] = useState(TUNING_OPTIONS[2]); // Stage 2
  const [selectedAero, setSelectedAero] = useState(AERO_OPTIONS[3]); // Widebody
  const [selectedStance, setSelectedStance] = useState(STANCE_OPTIONS[2]); // Track Stance

  // Audio / Rev State
  const [isRevving, setIsRevving] = useState(false);

  // Active Configuration Tab
  const [activeTab, setActiveTab] = useState<'paint' | 'wheels' | 'aero' | 'underglow' | 'tuning' | 'tint'>('paint');

  // Live Performance Calculations
  const totalHp = selectedVehicle.baseHp + selectedTuning.hp + (selectedAero.id !== 'stock' ? 15 : 0);
  const calculatedModPrice =
    selectedPaint.id === 'acid-lime' ? 1800 : 2100 +
    selectedRim.price +
    selectedTint.price +
    selectedUnderglow.price +
    selectedTuning.price +
    selectedAero.price +
    selectedStance.price;

  // Calculate 0-100 acceleration improvement
  const baseTime = parseFloat(selectedVehicle.accel);
  const timeReduction = (selectedTuning.hp / 320) * 0.7;
  const current0To100 = Math.max(2.1, (baseTime - timeReduction)).toFixed(1);

  const currentConfig: BookingConfig = {
    paint: selectedPaint.hex,
    paintName: selectedPaint.name,
    paintType: selectedPaint.type,
    rims: selectedRim.id,
    rimsName: selectedRim.name,
    tint: selectedTint.id,
    tintName: selectedTint.name,
    underglow: selectedUnderglow.hex,
    underglowPulse: underglowPulse,
    tuningStage: selectedTuning.name,
    aeroKit: selectedAero.name,
    stance: selectedStance.name,
    exhaust: 'Burnt Titanium Quad-Tip Valved',
  };

  const handleReset = () => {
    setSelectedPaint(PAINT_OPTIONS[3]); // Satin Black
    setSelectedRim(RIM_OPTIONS[1]);
    setSelectedTint(TINT_OPTIONS[0]);
    setSelectedUnderglow(UNDERGLOW_OPTIONS[0]);
    setSelectedTuning(TUNING_OPTIONS[0]);
    setSelectedAero(AERO_OPTIONS[0]);
    setSelectedStance(STANCE_OPTIONS[0]);
  };

  return (
    <section id="customizer" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            Interactive 2D Vehicle Studio
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Vertex <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-400 to-fuchsia-400">Customizer</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mt-1">
            Real-time paint, forged aerodynamics, stance and underglow configuration with live Web Audio twin-oscillator engine synthesis.
          </p>
        </div>

        {/* Model Presets Quick Select */}
        <div className="flex flex-wrap items-center gap-2">
          {VEHICLE_PRESETS.map((car) => (
            <button
              key={car.id}
              onClick={() => setSelectedVehicle(car)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedVehicle.id === car.id
                  ? 'bg-lime-500 text-neutral-950 font-bold shadow-[0_0_15px_rgba(132,204,22,0.4)]'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {car.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Display & Canvas Box */}
      <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-neutral-950 border border-neutral-800/80 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Top Floating HUD: Specs & Pricing */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-lime-500/10 border border-lime-500/20 text-lime-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Estimated Power</span>
              <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1">
                {totalHp} <span className="text-xs text-lime-400 font-normal">BHP</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">0-100 km/h</span>
              <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1">
                {current0To100} <span className="text-xs text-cyan-400 font-normal">SEC</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/80 border border-neutral-800 p-3 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Aero Package</span>
              <div className="text-xs font-bold text-neutral-200 truncate max-w-[120px]">
                {selectedAero.name.replace('Track ', '').replace('Full ', '')}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/80 border border-lime-500/30 p-3 flex items-center gap-3 bg-gradient-to-r from-lime-500/5 to-transparent">
            <div className="p-2.5 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Mod Investment</span>
              <div className="text-lg font-bold text-lime-400 font-mono">
                ₹{calculatedModPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2D Vector Supercar Render */}
        <div className="relative my-4 min-h-[260px] md:min-h-[360px] flex items-center justify-center">
          <CarGraphic
            paintHex={selectedPaint.hex}
            paintType={selectedPaint.type}
            rimId={selectedRim.id}
            rimColor={selectedRim.color}
            tintOpacity={selectedTint.opacity}
            tintColor={selectedTint.color}
            underglowColor={selectedUnderglow.hex}
            underglowPulse={underglowPulse}
            aeroKit={selectedAero.name}
            stanceDropMm={selectedStance.dropMm}
            isRevving={isRevving}
            modelId={selectedVehicle.id}
          />
        </div>

        {/* Engine Audio Synthesizer Bar */}
        <div className="relative z-10 mb-8">
          <EngineRevModule onRevChange={setIsRevving} />
        </div>

        {/* Customization Control Tabs */}
        <div className="relative z-10 border-t border-neutral-800/80 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
            {[
              { id: 'paint', label: 'Paint & Wraps', icon: Palette },
              { id: 'wheels', label: 'Forged Wheels', icon: Disc },
              { id: 'aero', label: 'Aero & Stance', icon: Layers },
              { id: 'underglow', label: 'Neon Underglow', icon: Sparkles },
              { id: 'tuning', label: 'Dyno Tuning', icon: Zap },
              { id: 'tint', label: 'Privacy Tint', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-neutral-800 text-lime-400 border border-lime-500/40 shadow-lg'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="mt-4 p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/60">
            {/* 1. PAINT & WRAPS */}
            {activeTab === 'paint' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider">
                    Available Custom Finishes (7 Signature Coatings)
                  </span>
                  <span className="text-xs text-lime-400 font-medium">
                    {selectedPaint.name} • {selectedPaint.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {PAINT_OPTIONS.map((paint) => {
                    const isSelected = selectedPaint.id === paint.id;
                    return (
                      <button
                        key={paint.id}
                        onClick={() => setSelectedPaint(paint)}
                        className={`group relative p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800/90 border-lime-500 ring-2 ring-lime-500/40'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="w-6 h-6 rounded-full border border-white/20 shadow-inner block"
                            style={{ backgroundColor: paint.hex }}
                          />
                          {isSelected && <Check className="w-4 h-4 text-lime-400" />}
                        </div>
                        <span className="text-xs font-semibold text-neutral-200 block truncate group-hover:text-white">
                          {paint.name}
                        </span>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {paint.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. FORGED WHEELS */}
            {activeTab === 'wheels' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider">
                    Lightweight Forged Wheel Architectures
                  </span>
                  <span className="text-xs text-lime-400 font-mono">
                    {selectedRim.name} (₹{selectedRim.price.toLocaleString()})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {RIM_OPTIONS.map((rim) => {
                    const isSelected = selectedRim.id === rim.id;
                    return (
                      <button
                        key={rim.id}
                        onClick={() => setSelectedRim(rim)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800/90 border-lime-500 ring-2 ring-lime-500/40'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-neutral-200">{rim.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                            {rim.weight}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400">{rim.style}</p>
                        <span className="text-xs font-mono font-bold text-lime-400 mt-2 block">
                          ₹{rim.price.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. AERO & STANCE */}
            {activeTab === 'aero' && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider block mb-2">
                    Aerodynamic Body Package
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {AERO_OPTIONS.map((aero) => {
                      const isSelected = selectedAero.id === aero.id;
                      return (
                        <button
                          key={aero.id}
                          onClick={() => setSelectedAero(aero)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-800 border-lime-500 ring-1 ring-lime-500/40'
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-neutral-200 mb-1">{aero.name}</div>
                          <div className="text-[11px] text-neutral-400">{aero.downforce}</div>
                          <div className="text-xs font-mono text-lime-400 mt-2">
                            {aero.price > 0 ? `+₹${aero.price.toLocaleString()}` : 'Included'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider block mb-2">
                    Suspension Height & Stance
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {STANCE_OPTIONS.map((st) => {
                      const isSelected = selectedStance.id === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setSelectedStance(st)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-neutral-800 border-cyan-500 ring-1 ring-cyan-500/40'
                              : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-neutral-200 mb-1">{st.name}</div>
                          <div className="text-[11px] text-neutral-400">
                            {st.dropMm > 0 ? `Chassis Drop: -${st.dropMm}mm` : 'Factory Clearance'}
                          </div>
                          <div className="text-xs font-mono text-cyan-400 mt-2">
                            {st.price > 0 ? `+₹${st.price.toLocaleString()}` : 'OEM'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. NEON UNDERGLOW */}
            {activeTab === 'underglow' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider">
                    Digital Addressable Neon Ground Tube
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={underglowPulse}
                      onChange={(e) => setUnderglowPulse(e.target.checked)}
                      className="rounded bg-neutral-800 border-neutral-700 text-lime-500 focus:ring-lime-500/20"
                    />
                    <span>Pulse Breathing Effect</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {UNDERGLOW_OPTIONS.map((ug) => {
                    const isSelected = selectedUnderglow.id === ug.id;
                    return (
                      <button
                        key={ug.id}
                        onClick={() => setSelectedUnderglow(ug)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-lime-500 ring-2 ring-lime-500/40'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 block"
                            style={{
                              backgroundColor: ug.hex,
                              boxShadow: ug.hex !== 'transparent' ? `0 0 10px ${ug.hex}` : 'none',
                            }}
                          />
                          {isSelected && <Check className="w-4 h-4 text-lime-400 ml-auto" />}
                        </div>
                        <span className="text-xs font-semibold text-neutral-200 block truncate">
                          {ug.name}
                        </span>
                        <span className="text-[10px] font-mono text-lime-400">
                          {ug.price > 0 ? `₹${ug.price.toLocaleString()}` : 'Off'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. PERFORMANCE TUNING */}
            {activeTab === 'tuning' && (
              <div>
                <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider block mb-3">
                  Vertex Lab ECU Calibration & Forced Induction
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {TUNING_OPTIONS.map((tune) => {
                    const isSelected = selectedTuning.id === tune.id;
                    return (
                      <button
                        key={tune.id}
                        onClick={() => setSelectedTuning(tune)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-lime-500 ring-2 ring-lime-500/40'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-neutral-100">{tune.name}</span>
                          {tune.hp > 0 && (
                            <span className="text-[10px] font-mono font-bold text-lime-400 bg-lime-500/10 px-1.5 py-0.5 rounded">
                              +{tune.hp} HP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400">{tune.sound}</p>
                        <span className="text-xs font-mono font-bold text-lime-400 mt-2 block">
                          {tune.price > 0 ? `+₹${tune.price.toLocaleString()}` : 'Stock'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. WINDOW TINT */}
            {activeTab === 'tint' && (
              <div>
                <span className="text-xs uppercase font-mono text-neutral-400 tracking-wider block mb-3">
                  Ceramic Heat-Rejecting Nano Window Tint
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {TINT_OPTIONS.map((tint) => {
                    const isSelected = selectedTint.id === tint.id;
                    return (
                      <button
                        key={tint.id}
                        onClick={() => setSelectedTint(tint)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800 border-cyan-500 ring-2 ring-cyan-500/40'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-neutral-200">{tint.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 mt-2 block">
                          {tint.price > 0 ? `+₹${tint.price.toLocaleString()}` : 'OEM'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Triggers Footer */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset To OEM Stock
            </button>

            <div className="flex items-center gap-3">
              {onOpenGalleryPublish && (
                <button
                  onClick={() => onOpenGalleryPublish(currentConfig, selectedVehicle.name)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Publish To User Gallery
                </button>
              )}

              <button
                onClick={() => onSelectForBooking(currentConfig, selectedVehicle.name, calculatedModPrice)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 shadow-[0_0_20px_rgba(132,204,22,0.4)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Book Workshop Build With This Spec
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
