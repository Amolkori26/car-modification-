import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Flame, Zap, Gauge, Radio } from 'lucide-react';
import { engineAudio } from '../utils/engineAudio';

interface EngineRevModuleProps {
  onRevChange?: (isRevving: boolean) => void;
}

export const EngineRevModule: React.FC<EngineRevModuleProps> = ({ onRevChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevving, setIsRevving] = useState(false);
  const [rpm, setRpm] = useState(850);
  const isRevvingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = engineAudio.subscribe((currentRpm, revState) => {
      setRpm(currentRpm);
      if (onRevChange && revState !== isRevvingRef.current) {
        isRevvingRef.current = revState;
        onRevChange(revState);
      }
    });

    return () => {
      unsubscribe();
      engineAudio.stop();
    };
  }, [onRevChange]);

  // Spacebar revving listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        startRev();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        stopRev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaying]);

  const toggleSound = () => {
    if (isPlaying) {
      engineAudio.stop();
      setIsPlaying(false);
      setIsRevving(false);
      if (onRevChange) onRevChange(false);
    } else {
      engineAudio.start();
      setIsPlaying(true);
    }
  };

  const startRev = () => {
    if (!isPlaying) {
      engineAudio.start();
      setIsPlaying(true);
    }
    setIsRevving(true);
    engineAudio.setRevving(true);
    if (onRevChange) onRevChange(true);
  };

  const stopRev = () => {
    setIsRevving(false);
    engineAudio.setRevving(false);
    if (onRevChange) onRevChange(false);
  };

  // Tachometer geometry (Angle from -120deg at 850 RPM to +120deg at 7500 RPM)
  const normRpm = Math.max(0, Math.min(1, (rpm - 850) / (7500 - 850)));
  const needleAngle = -120 + normRpm * 240;
  const isRedline = rpm >= 6400;

  return (
    <div className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 p-5 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Background ambient neon glow */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-opacity duration-300 pointer-events-none ${
          isRevving ? 'bg-lime-500/30' : isPlaying ? 'bg-cyan-500/20' : 'bg-transparent'
        }`}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Engine Sound Engine Info & Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={toggleSound}
            className={`relative flex items-center justify-center w-14 h-14 rounded-2xl border transition-all duration-300 shadow-lg cursor-pointer ${
              isPlaying
                ? 'bg-lime-500/20 border-lime-500/80 text-lime-400 shadow-lime-500/20'
                : 'bg-neutral-800/80 border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500'
            }`}
            aria-label={isPlaying ? 'Mute engine audio' : 'Start engine synthesizer'}
          >
            {isPlaying ? <Volume2 className="w-6 h-6 animate-pulse" /> : <VolumeX className="w-6 h-6" />}
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500" />
              </span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-lime-400 font-semibold flex items-center gap-1.5">
                <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse text-lime-400' : 'text-neutral-500'}`} />
                Web Audio Synthesizer
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 font-mono">
                55Hz - 180Hz
              </span>
            </div>
            <h4 className="text-base font-bold text-neutral-100 flex items-center gap-2">
              Bespoke V8 Biturbo Audio
              {isRedline && (
                <span className="text-[10px] bg-red-500/20 border border-red-500/60 text-red-400 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                  REDLINE
                </span>
              )}
            </h4>
            <p className="text-xs text-neutral-400">
              {isPlaying
                ? isRevving
                  ? 'Exhaust valving open • 180 Hz high-RPM roar'
                  : 'Idling smooth • 55 Hz dual sawtooth & triangle nodes'
                : 'Engine off • Press Start or Hold Rev to ignite'}
            </p>
          </div>
        </div>

        {/* Center: Interactive Tachometer Gauge */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-36 h-28 flex items-center justify-center">
            {/* SVG Tachometer Arc */}
            <svg viewBox="0 0 160 110" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="60%" stopColor="#84cc16" />
                  <stop offset="85%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>

              {/* Gauge Background Track */}
              <path
                d="M 25 95 A 65 65 0 1 1 135 95"
                fill="none"
                stroke="#262626"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Gauge Active Progress Arc */}
              <path
                d="M 25 95 A 65 65 0 1 1 135 95"
                fill="none"
                stroke="url(#gaugeGrad)"
                strokeWidth="10"
                strokeDasharray="280"
                strokeDashoffset={280 - normRpm * 280}
                strokeLinecap="round"
                className="transition-all duration-75"
              />

              {/* Redline Hash Marks */}
              <path
                d="M 120 70 A 65 65 0 0 1 135 95"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />

              {/* Center Needle Pivot */}
              <circle cx="80" cy="95" r="7" fill="#171717" stroke="#737373" strokeWidth="2" />

              {/* Needle Indicator */}
              <g transform={`rotate(${needleAngle}, 80, 95)`} className="transition-transform duration-75 ease-out">
                <line x1="80" y1="95" x2="80" y2="40" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                <polygon points="78,40 82,40 80,32" fill="#f43f5e" />
              </g>
            </svg>

            {/* Digital RPM Overlay */}
            <div className="absolute bottom-0 text-center">
              <span className={`text-xl font-mono font-bold tracking-tight transition-colors ${
                isRedline ? 'text-red-400 animate-pulse' : 'text-neutral-100'
              }`}>
                {rpm.toLocaleString()}
              </span>
              <span className="block text-[9px] font-mono uppercase tracking-wider text-neutral-400">
                RPM
              </span>
            </div>
          </div>
        </div>

        {/* Right: HOLD TO REV Interactive Button */}
        <div className="flex flex-col items-center gap-2 w-full md:w-auto">
          <button
            onMouseDown={startRev}
            onMouseUp={stopRev}
            onMouseLeave={stopRev}
            onTouchStart={(e) => {
              e.preventDefault();
              startRev();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stopRev();
            }}
            className={`relative group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold tracking-wider uppercase text-sm select-none transition-all duration-150 cursor-pointer overflow-hidden ${
              isRevving
                ? 'bg-gradient-to-r from-lime-500 to-emerald-400 text-neutral-950 shadow-[0_0_35px_rgba(132,204,22,0.7)] scale-98 ring-2 ring-lime-300'
                : 'bg-neutral-800 hover:bg-neutral-700/90 text-neutral-200 border border-neutral-700 hover:border-lime-500/50 shadow-lg'
            }`}
          >
            <Zap className={`w-5 h-5 transition-transform ${isRevving ? 'animate-bounce text-neutral-950' : 'text-lime-400 group-hover:scale-110'}`} />
            <span>{isRevving ? 'THROTTLE W.O.T. !!' : 'HOLD TO REV'}</span>
            <Flame className={`w-5 h-5 ${isRevving ? 'text-orange-950 animate-pulse' : 'text-neutral-500'}`} />

            {/* Shimmer sweep on active rev */}
            {isRevving && (
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1s_infinite]" />
            )}
          </button>
          <span className="text-[10px] font-mono text-neutral-400 tracking-wide">
            Tip: Press & hold <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">Space</kbd> or touch to rev
          </span>
        </div>
      </div>
    </div>
  );
};
