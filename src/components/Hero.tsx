import React from 'react';
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  Zap,
  Gauge,
  Radio,
  Activity,
  Flame
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-lime-500/20 via-cyan-500/15 to-fuchsia-500/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="text-center max-w-4xl mx-auto">
        {/* Capstone Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-neutral-300 text-xs font-mono mb-6 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span className="text-lime-400 font-bold uppercase tracking-wider">Capstoned 2026</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-300">Neon Glass Vehicle Customizer & Command Dashboard</span>
        </div>

        {/* Main Catchy Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-['Rajdhani'] leading-none">
          Redefine <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-300 to-fuchsia-500">
            Automotive Reality
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed">
          The next-generation vehicle customization platform with zero-latency 2D visualizer, Web Audio engine synthesizer, parts inventory database, and synchronized workshop command queue.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#customizer"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-neutral-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(132,204,22,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-sans"
          >
            <Sliders className="w-4 h-4" />
            Launch 2D Customizer
          </a>

          <a
            href="#admin-portal"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-neutral-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-sans ring-2 ring-cyan-300/40"
          >
            <Activity className="w-4 h-4" />
            Open Dashboard
          </a>

          <a
            href="#parts"
            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer font-sans"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            Parts Database
          </a>

          <a
            href="#gallery"
            className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-fuchsia-500/50 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer font-sans"
          >
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            User Project Galleries
          </a>
        </div>

        {/* Live Ticker Bar */}
        <div className="mt-14 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-around gap-6 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-lime-500/10 text-lime-400">
              <Zap className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase block">Audio Engine</span>
              <span className="font-bold text-neutral-200">55Hz Idle → 180Hz Redline</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase block">Workshop Status</span>
              <span className="font-bold text-cyan-400">4 Synchronized Bays Active</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-400">
              <Gauge className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase block">Peak Dyno Spec</span>
              <span className="font-bold text-neutral-200">885 BHP / 1,020 Nm</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="w-4 h-4" />
            </span>
            <div className="text-left">
              <span className="text-[10px] text-neutral-400 uppercase block">Overrun Exhaust</span>
              <span className="font-bold text-amber-400">Valved Titanium Burble</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
