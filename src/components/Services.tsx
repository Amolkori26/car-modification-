import React from 'react';
import {
  Zap,
  Palette,
  Wind,
  Disc,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ServicesProps {
  onSelectService?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const servicesList = [
    {
      id: 'srv-dyno',
      icon: Zap,
      title: 'Precision ECU Dyno Tuning',
      category: 'Powertrain Engineering',
      desc: 'All-wheel drive rolling road dyno testing, bespoke high-boost calibrations, switchable anti-lag, and telemetry datalogging.',
      leadTime: '1 - 3 Days',
      priceFrom: '₹1,850',
      color: 'from-amber-500/20 to-lime-500/10',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
    },
    {
      id: 'srv-wrap',
      icon: Palette,
      title: 'Bespoke Paint & Multi-Cast Wraps',
      category: 'Surface Aesthetics',
      desc: 'Climate-controlled cleanroom applications of ultra-gloss metallic, chameleon pearls, stealth satins, and ceramic hydrophobic coatings.',
      leadTime: '3 - 5 Days',
      priceFrom: '₹2,400',
      color: 'from-lime-500/20 to-emerald-500/10',
      borderColor: 'border-lime-500/30',
      textColor: 'text-lime-400',
    },
    {
      id: 'srv-aero',
      icon: Wind,
      title: 'Pre-Preg Carbon Aero Fabrication',
      category: 'Downforce Engineering',
      desc: 'Autoclave-cured dry carbon widebody packages, CFD-validated splitters, swan-neck wings, and functional aerodynamic diffusers.',
      leadTime: '4 - 7 Days',
      priceFrom: '₹3,800',
      color: 'from-cyan-500/20 to-blue-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
    {
      id: 'srv-wheels',
      icon: Disc,
      title: 'Forged Wheels & Track Stance',
      category: 'Chassis & Dynamics',
      desc: 'Aerospace 6061-T6 monoblock forged wheels with bespoke offsets, paired with 3-way adjustable monotube track coilover setups.',
      leadTime: '2 - 4 Days',
      priceFrom: '₹3,200',
      color: 'from-fuchsia-500/20 to-purple-500/10',
      borderColor: 'border-fuchsia-500/30',
      textColor: 'text-fuchsia-400',
    },
    {
      id: 'srv-neon',
      icon: Sparkles,
      title: 'Addressable Neon Underglow Architecture',
      category: 'Electrical Integration',
      desc: 'IP68 dynamic NeoPixel tubes routed through concealed aluminum subchassis channels with low-latency smartphone and rev sync.',
      leadTime: '1 Day',
      priceFrom: '₹650',
      color: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-400',
    },
    {
      id: 'srv-brake',
      icon: ShieldAlert,
      title: 'Carbon Ceramic Brakes & Safety Cages',
      category: 'Track Compliance',
      desc: '400mm carbon-silicon carbide rotors, 6-piston monoblock calipers, FIA-compliant CDS roll cages, and multi-point race harnesses.',
      leadTime: '3 - 6 Days',
      priceFrom: '₹4,900',
      color: 'from-rose-500/20 to-orange-500/10',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <section id="services" className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
          Comprehensive Workshop Programs
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
          Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-cyan-400 to-fuchsia-400">Engineering Services</span>
        </h2>
        <p className="text-neutral-400 text-sm md:text-base mt-2">
          From computer-simulated aerodynamic development to hand-laid dry carbon and high-boost dyno tuning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.map((srv) => {
          const Icon = srv.icon;
          return (
            <div
              key={srv.id}
              className={`group rounded-3xl bg-neutral-900/80 border ${srv.borderColor} p-6 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${srv.color} ${srv.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-950 text-neutral-400 border border-neutral-800">
                    {srv.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">Lead Time: {srv.leadTime}</span>
                  <span className="text-xs font-mono font-bold text-neutral-200">Starting from {srv.priceFrom}</span>
                </div>

                <button
                  onClick={() => {
                    if (onSelectService) onSelectService(srv.title);
                    const el = document.getElementById('booking');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 cursor-pointer"
                >
                  Schedule Bay
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
