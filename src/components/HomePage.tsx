import React from 'react';
import { AppPage } from '../types';
import {
  Sliders,
  Sparkles,
  Layers,
  Wrench,
  Disc,
  Calendar,
  Activity,
  ArrowRight,
  Zap,
  Gauge,
  Flame,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  activeBookingsCount: number;
  isAdmin?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, activeBookingsCount, isAdmin = false }) => {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION (Without standalone Open Dashboard button) */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
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

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase font-['Rajdhani'] leading-none">
            Redefine <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-300 to-fuchsia-500">
              Automotive Reality
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-sans leading-relaxed">
            The next-generation vehicle customization platform with zero-latency 2D visualizer, Web Audio engine synthesizer, and synchronized workshop command queue.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('customizer')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-400 to-emerald-400 hover:from-lime-300 hover:to-emerald-300 text-neutral-950 font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(132,204,22,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-sans"
            >
              <Sliders className="w-4 h-4" />
              Launch 2D Customizer
            </button>

            {/* Parts Database button is restricted to Admin only */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('parts')}
                className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-cyan-500/50 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer font-sans"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                Parts Database
              </button>
            )}

            <button
              onClick={() => onNavigate('gallery')}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-fuchsia-500/50 text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg cursor-pointer font-sans"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              User Project Galleries
            </button>
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

      {/* 2. DEDICATED FUNCTION PORTAL TILES */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            Integrated Application Pages
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
            Explore Dedicated <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Capabilities</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Navigate through each specialized workshop suite or access the command dashboard right from the top menu bar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customizer Card */}
          <div
            onClick={() => onNavigate('customizer')}
            className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-lime-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(132,204,22,0.15)] cursor-pointer"
          >
            <div>
              <div className="p-3 rounded-2xl bg-lime-500/10 text-lime-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                2D Vehicle Customizer
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Configure paints, forged monoblock wheels, dry carbon aero kits, stance lowering, and experience real-time Web Audio V8 engine revving.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-lime-400 font-bold">
              <span>Open Studio Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Comparison Card */}
          <div
            onClick={() => onNavigate('comparison')}
            className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer"
          >
            <div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                Telemetry Comparison
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Inspect 1:1 right-side profile transformation between factory stock OEM and full Vertex custom build with interactive split slider.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
              <span>Open Comparison Slider</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Parts Database Card - Restricted to Admin only */}
          {isAdmin && (
            <div
              onClick={() => onNavigate('parts')}
              className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-lime-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(132,204,22,0.15)] cursor-pointer"
            >
              <div>
                <div className="p-3 rounded-2xl bg-lime-500/10 text-lime-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                  Parts & Hardware Catalog
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Full database of aerospace grade carbon aero, titanium valved cat-backs, and forged lightweight wheels.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-lime-400 font-bold">
                <span>Browse Parts Index</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* User Galleries Card */}
          <div
            onClick={() => onNavigate('gallery')}
            className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-fuchsia-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(192,38,211,0.15)] cursor-pointer"
          >
            <div>
              <div className="p-3 rounded-2xl bg-fuchsia-500/10 text-fuchsia-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors mb-2">
                Custom Build Galleries
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Showcase of verified owner creations, likes interaction, detailed parts specs, and community project publishing.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-fuchsia-400 font-bold">
              <span>Explore Community Builds</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Workshop Services Card */}
          <div
            onClick={() => onNavigate('services')}
            className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer"
          >
            <div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Disc className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                Engineering Services
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dyno tuning calibrations, cleanroom multi-cast wraps, autoclave carbon fabrication, and FIA safety compliance.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
              <span>View Service Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Bay Booking Card */}
          <div
            onClick={() => onNavigate('booking')}
            className="group rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] cursor-pointer"
          >
            <div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                Workshop Bay Reservation
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Three-step guided scheduling collecting machine specs, options, client telemetry, and generating unique ticket tokens.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
              <span>Reserve Workshop Bay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP TERMINAL OVERVIEW BANNER */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase">
              <Activity className="w-3.5 h-3.5" />
              Command Dashboard in Menu Bar
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white font-['Rajdhani'] uppercase">
              Operational Command Terminal
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Workshop administrators can inspect incoming bookings, assign bays, update progress percentages, reorder low stock parts, and review activity audit logs directly via the Dashboard menu item.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-cyan-400 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg cursor-pointer shrink-0"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Go to Dashboard Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
