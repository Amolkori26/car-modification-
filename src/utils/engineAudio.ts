/**
 * Web Audio API Engine Synthesizer for Vertex Customs
 * Based on Project Report specifications:
 * - Two oscillator nodes: Sawtooth (sharp exhaust harmonics) & Triangle (low engine-block rumble)
 * - Base idle frequency: 55 Hz (~850 RPM)
 * - "Hold to Rev" interaction ramps frequency to 180 Hz (~7,500 RPM) over 0.6s
 * - Exhaust pops & burble synthesis on throttle lift
 */

class EngineSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private sawtoothOsc: OscillatorNode | null = null;
  private triangleOsc: OscillatorNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;
  private idleLfo: OscillatorNode | null = null;
  private idleLfoGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isRevvingState: boolean = false;
  private currentFreq: number = 55;
  private listeners: Array<(rpm: number, isRevving: boolean) => void> = [];
  private animFrameId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (rpm: number, isRevving: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    // Map 55 Hz (850 RPM) to 180 Hz (7,500 RPM)
    const normalized = Math.max(0, Math.min(1, (this.currentFreq - 55) / (180 - 55)));
    const rpm = Math.round(850 + normalized * (7500 - 850));
    this.listeners.forEach((l) => l(rpm, this.isRevvingState));
  }

  public start() {
    if (this.isRunning) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(0.25, now + 0.15);
    this.masterGain.connect(this.ctx.destination);

    // Resonant Lowpass filter to simulate exhaust muffler & combustion resonance
    this.lowpassFilter = this.ctx.createBiquadFilter();
    this.lowpassFilter.type = 'lowpass';
    this.lowpassFilter.frequency.setValueAtTime(450, now);
    this.lowpassFilter.Q.setValueAtTime(3.2, now);
    this.lowpassFilter.connect(this.masterGain);

    // 1. Sawtooth Oscillator (sharp exhaust rasps & high-order harmonics)
    this.sawtoothOsc = this.ctx.createOscillator();
    this.sawtoothOsc.type = 'sawtooth';
    this.sawtoothOsc.frequency.setValueAtTime(55, now);

    const sawGain = this.ctx.createGain();
    sawGain.gain.setValueAtTime(0.18, now);
    this.sawtoothOsc.connect(sawGain);
    sawGain.connect(this.lowpassFilter);

    // 2. Triangle Oscillator (deep engine block vibration & low-end roar)
    this.triangleOsc = this.ctx.createOscillator();
    this.triangleOsc.type = 'triangle';
    this.triangleOsc.frequency.setValueAtTime(55, now);

    const triGain = this.ctx.createGain();
    triGain.gain.setValueAtTime(0.35, now);
    this.triangleOsc.connect(triGain);
    triGain.connect(this.lowpassFilter);

    // 3. Subtle Idle LFO (gives organic cylinder combustion rhythm)
    this.idleLfo = this.ctx.createOscillator();
    this.idleLfo.frequency.setValueAtTime(14, now); // ~14 Hz cylinder firing flutter
    this.idleLfoGain = this.ctx.createGain();
    this.idleLfoGain.gain.setValueAtTime(3.5, now);
    this.idleLfo.connect(this.idleLfoGain);
    this.idleLfoGain.connect(this.sawtoothOsc.frequency);
    this.idleLfoGain.connect(this.triangleOsc.frequency);

    this.sawtoothOsc.start(now);
    this.triangleOsc.start(now);
    this.idleLfo.start(now);

    this.isRunning = true;
    this.currentFreq = 55;
    this.startTracking();
  }

  private startTracking() {
    const loop = () => {
      this.notify();
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  public setRevving(rev: boolean) {
    if (!this.isRunning || !this.ctx || !this.sawtoothOsc || !this.triangleOsc || !this.lowpassFilter || !this.masterGain) {
      if (rev) {
        this.start();
        setTimeout(() => this.setRevving(true), 50);
      }
      return;
    }

    const now = this.ctx.currentTime;
    this.isRevvingState = rev;

    if (rev) {
      // Hold to Rev: Ramps frequency from 55 Hz to 180 Hz over 0.6 seconds
      const targetFreq = 180;
      const rampDuration = 0.6;

      this.sawtoothOsc.frequency.cancelScheduledValues(now);
      this.triangleOsc.frequency.cancelScheduledValues(now);
      this.lowpassFilter.frequency.cancelScheduledValues(now);
      this.masterGain.gain.cancelScheduledValues(now);

      this.sawtoothOsc.frequency.setValueAtTime(this.currentFreq, now);
      this.triangleOsc.frequency.setValueAtTime(this.currentFreq, now);

      this.sawtoothOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + rampDuration);
      this.triangleOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + rampDuration);

      // Open exhaust filter for aggressive acoustic growl
      this.lowpassFilter.frequency.exponentialRampToValueAtTime(2600, now + rampDuration);
      this.masterGain.gain.linearRampToValueAtTime(0.42, now + 0.2);

      // Track frequency estimate for gauge
      const startT = performance.now();
      const startF = this.currentFreq;
      const updateInterval = setInterval(() => {
        if (!this.isRevvingState) {
          clearInterval(updateInterval);
          return;
        }
        const elapsed = (performance.now() - startT) / (rampDuration * 1000);
        if (elapsed >= 1) {
          this.currentFreq = targetFreq;
          clearInterval(updateInterval);
        } else {
          this.currentFreq = startF + (targetFreq - startF) * elapsed;
        }
      }, 16);
    } else {
      // Throttle Lift: Ramps back down to idle 55 Hz over ~0.75 seconds
      const targetFreq = 55;
      const rampDuration = 0.75;

      this.sawtoothOsc.frequency.cancelScheduledValues(now);
      this.triangleOsc.frequency.cancelScheduledValues(now);
      this.lowpassFilter.frequency.cancelScheduledValues(now);
      this.masterGain.gain.cancelScheduledValues(now);

      this.sawtoothOsc.frequency.setValueAtTime(this.currentFreq, now);
      this.triangleOsc.frequency.setValueAtTime(this.currentFreq, now);

      this.sawtoothOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + rampDuration);
      this.triangleOsc.frequency.exponentialRampToValueAtTime(targetFreq, now + rampDuration);

      this.lowpassFilter.frequency.exponentialRampToValueAtTime(450, now + rampDuration);
      this.masterGain.gain.linearRampToValueAtTime(0.25, now + 0.3);

      // Trigger high-RPM overrun pops/burbles on sudden throttle release!
      if (this.currentFreq > 110) {
        this.triggerOverrunBurbles(now);
      }

      const startT = performance.now();
      const startF = this.currentFreq;
      const updateInterval = setInterval(() => {
        if (this.isRevvingState) {
          clearInterval(updateInterval);
          return;
        }
        const elapsed = (performance.now() - startT) / (rampDuration * 1000);
        if (elapsed >= 1) {
          this.currentFreq = targetFreq;
          clearInterval(updateInterval);
        } else {
          this.currentFreq = startF + (targetFreq - startF) * elapsed;
        }
      }, 16);
    }
  }

  // Synthesize realistic backfire pops & burbles via filtered noise bursts
  private triggerOverrunBurbles(startTime: number) {
    if (!this.ctx) return;

    const popDelays = [0.08, 0.22, 0.38, 0.52];
    popDelays.forEach((delay) => {
      if (Math.random() > 0.15) {
        const popTime = startTime + delay;
        const bufferSize = this.ctx!.sampleRate * 0.04; // 40ms burst
        const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }

        const noise = this.ctx!.createBufferSource();
        noise.buffer = buffer;

        const popFilter = this.ctx!.createBiquadFilter();
        popFilter.type = 'bandpass';
        popFilter.frequency.setValueAtTime(220 + Math.random() * 300, popTime);
        popFilter.Q.setValueAtTime(1.8, popTime);

        const popGain = this.ctx!.createGain();
        popGain.gain.setValueAtTime(0.28, popTime);
        popGain.gain.exponentialRampToValueAtTime(0.001, popTime + 0.045);

        noise.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(this.ctx!.destination);

        noise.start(popTime);
      }
    });
  }

  public stop() {
    if (!this.isRunning || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.2);
    }
    setTimeout(() => {
      try {
        this.sawtoothOsc?.stop();
        this.triangleOsc?.stop();
        this.idleLfo?.stop();
        this.sawtoothOsc?.disconnect();
        this.triangleOsc?.disconnect();
        this.lowpassFilter?.disconnect();
        this.masterGain?.disconnect();
      } catch (e) {
        // Safe disconnect
      }
      this.isRunning = false;
      this.isRevvingState = false;
      this.currentFreq = 55;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
      this.notify();
    }, 220);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const engineAudio = new EngineSoundSynthesizer();
