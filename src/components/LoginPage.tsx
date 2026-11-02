import React, { useState } from 'react';
import { UserSession } from '../types';
import {
  ShieldCheck,
  User,
  Wrench,
  ArrowRight,
  Lock,
  Mail,
  Zap,
  Activity,
  Car,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  KeyRound
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (session: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'client' | 'admin'>('client');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-configured Quick Demo Profile (Client Only for security)
  const clientProfile: UserSession = {
    id: 'usr-client-01',
    name: 'Marcus Vance',
    role: 'client',
    email: 'marcus.vance@velocity.io',
    avatar: '',
    garageCount: 2,
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and passcode');
      return;
    }

    // Security check for Workshop Admin access
    if (selectedRole === 'admin') {
      const authorizedPasscodes = ['admin2026', 'vertex@2026', 'vertex-admin', 'admin'];
      if (!authorizedPasscodes.includes(password.trim())) {
        setErrorMsg('Security Authentication Failed: Invalid Workshop Admin security passcode. Authorized key required (e.g. admin2026).');
        return;
      }
    }

    const session: UserSession = {
      id: `usr-${Date.now()}`,
      name:
        selectedRole === 'admin' && email.toLowerCase().includes('kane')
          ? 'Viktor Kane'
          : email.split('@')[0].replace('.', ' ').toUpperCase(),
      role: selectedRole,
      email: email.trim(),
      avatar: '',
      garageCount: selectedRole === 'admin' ? 14 : 1,
    };

    onLogin(session);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-lime-500/15 via-cyan-500/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Simple Header */}
      <header className="p-6 md:p-8 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(132,204,22,0.4)]">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <span className="font-['Rajdhani'] font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">
                V
              </span>
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-widest text-white uppercase font-['Rajdhani'] block leading-none">
              VERTEX <span className="text-lime-400">CUSTOMS</span>
            </span>
            <span className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase block">
              Vehicle Studio & Command Terminal
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>Capstone Year: 2026</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300">Amol Kori</span>
        </div>
      </header>

      {/* Center Main Login Gateway Box */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl bg-neutral-900/90 border border-neutral-800/80 p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Accent Glow Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400 via-cyan-400 to-fuchsia-500" />

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              Secure Portal Authentication
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
              Access Vertex Terminal
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Select client demo access or sign in with your authorized workshop credentials.
            </p>
          </div>

          {/* Quick One-Click Demo Profile - Client Demo Only (Workshop Staff removed for security) */}
          <div className="mb-6 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
                Instant Demo Access (Recommended)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Staff Role Password-Guarded
              </span>
            </div>

            {/* Client Demo Profile Button Only */}
            <button
              type="button"
              onClick={() => onLogin(clientProfile)}
              className="w-full group p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-lime-500/60 hover:bg-neutral-900/80 transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(132,204,22,0.15)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20 group-hover:scale-110 transition-transform shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-lime-400 transition-colors">
                      Client / Driver Demo
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase bg-lime-500/20 text-lime-400 border border-lime-500/30">
                      Recommended
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-300 block truncate font-medium">
                    {clientProfile.name} • {clientProfile.email}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono block truncate">
                    2D Customizer, Audio Engine, Galleries & Bay Booking
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-lime-500/40 text-neutral-400 group-hover:text-lime-400 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-800" />
            </div>
            <span className="relative px-3 bg-neutral-900 text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              Or Sign In With Credentials
            </span>
          </div>

          {/* Manual Credentials Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5">Intended Access Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('client');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border text-center transition-all cursor-pointer ${
                    selectedRole === 'client'
                      ? 'bg-neutral-800 text-lime-400 border-lime-500/50 shadow-md'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  Client / Driver
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setErrorMsg('');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRole === 'admin'
                      ? 'bg-neutral-800 text-cyan-400 border-cyan-500/50 shadow-md'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  Workshop Admin
                </button>
              </div>
            </div>

            {selectedRole === 'admin' && (
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Admin Security Enforced: Requires authorized workshop passcode (<strong className="text-white font-bold">admin2026</strong>).
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={selectedRole === 'admin' ? 'e.g. v.kane@vertexcustoms.io' : 'e.g. driver@velocity.io'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1.5">
                {selectedRole === 'admin' ? 'Security Passcode / Master Key' : 'Passcode'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={selectedRole === 'admin' ? 'Enter admin passcode (e.g. admin2026)' : '••••••••••••'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 text-neutral-950 font-bold text-xs uppercase font-mono tracking-wider shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>Authenticate & Enter Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer Feature Trust Indicators */}
      <footer className="p-6 border-t border-neutral-900 max-w-7xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
              Real-Time 2D Supercar Studio
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Web Audio 55Hz-180Hz Engine Synth
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400" />
              Live Bay Telemetry & Parts in ₹
            </span>
          </div>

          <span className="text-[11px] text-neutral-400">
            Vertex Customs © 2026 • Final Year Capstone Project by Amol Kori
          </span>
        </div>
      </footer>
    </div>
  );
};
