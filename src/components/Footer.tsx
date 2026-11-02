import React from 'react';
import { Sparkles, Code2, Cpu, Wrench, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-neutral-950 border-t border-neutral-800/80 pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Capstone Details */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-cyan-400 p-0.5">
                <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-['Rajdhani'] font-black text-lg text-lime-400">V</span>
                </div>
              </div>
              <span className="text-xl font-black tracking-widest text-white uppercase font-['Rajdhani']">
                VERTEX <span className="text-lime-400">CUSTOMS</span>
              </span>
            </div>

            <p className="text-xs text-neutral-400 max-w-md leading-relaxed mb-4">
              Neon Glass Vehicle Customizer & Operational Command Dashboard. Developed as a Computer Science & Engineering Final Year Capstone Project (Academic Year: 2026) by <strong className="text-neutral-200">Amol Kori</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-neutral-400">
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">React 19</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">Express API</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">Web Audio API (55Hz-180Hz)</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800">TypeScript</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <a href="#customizer" className="hover:text-lime-400 transition-colors">
                  2D Vehicle Customizer
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-lime-400 transition-colors">
                  Before / After Split Slider
                </a>
              </li>
              <li>
                <a href="#parts" className="hover:text-lime-400 transition-colors">
                  Parts Database & Inventory
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-lime-400 transition-colors">
                  Custom User Project Galleries
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-lime-400 transition-colors">
                  Three-Step Bay Reservation
                </a>
              </li>
            </ul>
          </div>

          {/* Workshop Command Facility */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Workshop Facility
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>Vertex Operational Hangars 01-04</p>
              <p>Dyno, Cleanroom Wrap & Aero Fab</p>
              <p className="font-mono text-lime-400">Mon - Sat: 08:00 - 20:00 PST</p>
              <p className="font-mono text-neutral-500">Telemetry: ops@vertexcustoms.io</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 font-mono">
          <div>
            © 2026 Vertex Customs • Final Year Capstone by Amol Kori. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-neutral-400">
              Zero-latency SPA Architecture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
