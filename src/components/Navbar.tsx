import React, { useState } from 'react';
import { AppPage, UserSession } from '../types';
import {
  Wrench,
  Sliders,
  Layers,
  Sparkles,
  Calendar,
  Activity,
  Home,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  Disc
} from 'lucide-react';

interface NavbarProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  activeBookingsCount: number;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  activeBookingsCount,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dedicated Page Navigation items - with Dashboard inside the menu bar!
  // Parts Database is strictly restricted to Admin login only
  const navItems: Array<{ id: AppPage; label: string; icon: React.ElementType; badge?: number; adminOnly?: boolean }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'customizer', label: 'Customizer', icon: Sliders },
    { id: 'comparison', label: 'Comparison', icon: Wrench },
    { id: 'parts', label: 'Parts Database', icon: Layers, adminOnly: true },
    { id: 'gallery', label: 'Galleries', icon: Sparkles },
    { id: 'services', label: 'Services', icon: Disc },
    { id: 'booking', label: 'Bay Booking', icon: Calendar },
    { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: activeBookingsCount },
  ];

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || currentUser?.role === 'admin');

  const handleNavClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Navigates to Home */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left cursor-pointer shrink-0"
        >
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
        </button>

        {/* Desktop Navigation Links - Integrated with Dashboard in the menu! */}
        <nav className="hidden xl:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/80">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-sans whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-neutral-800 text-lime-400 border border-lime-500/40 shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lime-400' : 'text-neutral-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-lime-500 text-neutral-950 text-[10px] font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Menu (Laptop Compact Navigation) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1 bg-neutral-900/60 p-1.5 rounded-2xl border border-neutral-800/80">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer font-sans ${
                  isActive
                    ? 'bg-neutral-800 text-lime-400 border border-lime-500/40 shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[11px]">{item.label.replace(' Database', '')}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1 py-0.2 rounded-full bg-lime-500 text-neutral-950 text-[9px] font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Authenticated User Profile & Sign Out (No Standalone Dashboard Button!) */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-800">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs uppercase border ${
                  currentUser.role === 'admin'
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-lime-500/10 text-lime-400 border-lime-500/30'
                }`}
                title={currentUser.name}
              >
                {currentUser.role === 'admin' ? (
                  <Wrench className="w-4 h-4 text-cyan-400" />
                ) : (
                  <User className="w-4 h-4 text-lime-400" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-bold text-neutral-200 truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                      currentUser.role === 'admin'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono block mt-0.5 truncate max-w-[110px]">
                  {currentUser.email}
                </span>
              </div>

              {/* Sign Out Trigger */}
              <button
                onClick={onLogout}
                title="Sign out of Vertex Customs"
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-6 py-6 space-y-2">
          {/* User Profile in Mobile Drawer */}
          {currentUser && (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm uppercase border shrink-0 ${
                    currentUser.role === 'admin'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-lime-500/10 text-lime-400 border-lime-500/30'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <Wrench className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <User className="w-4 h-4 text-lime-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{currentUser.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        currentUser.role === 'admin'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-lime-500/20 text-lime-400'
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">{currentUser.email}</span>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-neutral-300 hover:text-rose-400 font-mono"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}

          {/* All Page Navigation Links */}
          <div className="grid grid-cols-1 gap-1.5">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-neutral-800 text-lime-400 border border-lime-500/40 shadow-sm'
                      : 'bg-neutral-900/50 text-neutral-300 hover:text-white border border-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-400' : 'text-neutral-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-lime-500 text-neutral-950 text-xs font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
