import React, { useState } from 'react';
import {
  Wrench,
  Sliders,
  Layers,
  Sparkles,
  Calendar,
  Activity,
  Menu,
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeBookingsCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Customizer', href: '#customizer', icon: Sliders },
    { label: 'Comparison', href: '#comparison', icon: Wrench },
    { label: 'Parts Database', href: '#parts', icon: Layers },
    { label: 'User Galleries', href: '#gallery', icon: Sparkles },
    { label: 'Services', href: '#services', icon: Activity },
    { label: 'Book Bay', href: '#booking', icon: Calendar },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(132,204,22,0.4)]">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <span className="font-['Rajdhani'] font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400 group-hover:scale-110 transition-transform">
                V
              </span>
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-widest text-white uppercase font-['Rajdhani'] block leading-none">
              VERTEX <span className="text-lime-400">CUSTOMS</span>
            </span>
            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block">
              Neon Glass Vehicle Studio
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all font-sans"
              >
                <Icon className="w-3.5 h-3.5 text-neutral-400" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right CTA: Admin Portal Command Terminal */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="#admin-portal"
            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/60 text-cyan-300 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Open Dashboard</span>
            {activeBookingsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-lime-400 text-neutral-950 text-[10px] font-bold font-mono">
                {activeBookingsCount}
              </span>
            )}
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-sm font-semibold text-neutral-200"
              >
                <Icon className="w-4 h-4 text-cyan-400" />
                {link.label}
              </a>
            );
          })}

          <a
            href="#admin-portal"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-lime-500/20 border border-cyan-400/50 text-sm font-mono font-bold text-cyan-300"
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Open Dashboard</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-lime-400 text-neutral-950 text-xs font-bold font-mono">
              {activeBookingsCount} Active
            </span>
          </a>
        </div>
      )}
    </header>
  );
};
