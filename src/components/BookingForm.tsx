import React, { useState, useEffect } from 'react';
import { Booking, BookingConfig } from '../types';
import {
  PAINT_OPTIONS,
  RIM_OPTIONS,
  TUNING_OPTIONS,
  AERO_OPTIONS,
  UNDERGLOW_OPTIONS,
} from '../data/mockData';
import {
  Car,
  Sliders,
  UserCheck,
  CheckCircle2,
  Calendar,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  Clock,
  Printer
} from 'lucide-react';

interface BookingFormProps {
  initialConfig?: BookingConfig | null;
  initialVehicle?: string;
  initialPrice?: number;
  onBookingCreated: (booking: Booking) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialConfig,
  initialVehicle = 'Nissan GT-R R35 Nismo',
  initialPrice = 14500,
  onBookingCreated,
}) => {
  // Step tracker: 1, 2, 3, or 'confirmed'
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 'confirmed'>(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Step 1: Machine Description
  const [makeModel, setMakeModel] = useState(initialVehicle);
  const [year, setYear] = useState('2024');
  const [vinNumber, setVinNumber] = useState('JN1-R35-VR38-99214');
  const [condition, setCondition] = useState('Showroom / Pristine OEM');

  // Step 2: Customization Options
  const [selectedPaintId, setSelectedPaintId] = useState('acid-lime');
  const [selectedRimId, setSelectedRimId] = useState('forged-split-bronze');
  const [selectedTuningId, setSelectedTuningId] = useState('stage2');
  const [selectedAeroId, setSelectedAeroId] = useState('widebody');
  const [selectedUnderglowId, setSelectedUnderglowId] = useState('lime');
  const [estimatedPrice, setEstimatedPrice] = useState(initialPrice);

  // Step 3: Client Telemetry
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [requestedDate, setRequestedDate] = useState('2026-10-22');
  const [notes, setNotes] = useState('');

  // Sync initial configuration when passed from visualizer
  useEffect(() => {
    if (initialConfig) {
      const matchPaint = PAINT_OPTIONS.find((p) => p.name === initialConfig.paintName);
      if (matchPaint) setSelectedPaintId(matchPaint.id);

      const matchRim = RIM_OPTIONS.find((r) => r.id === initialConfig.rims);
      if (matchRim) setSelectedRimId(matchRim.id);

      const matchTune = TUNING_OPTIONS.find((t) => t.name === initialConfig.tuningStage);
      if (matchTune) setSelectedTuningId(matchTune.id);

      const matchAero = AERO_OPTIONS.find((a) => a.name === initialConfig.aeroKit);
      if (matchAero) setSelectedAeroId(matchAero.id);
    }
    if (initialVehicle) {
      setMakeModel(initialVehicle);
    }
    if (initialPrice) {
      setEstimatedPrice(initialPrice);
    }
  }, [initialConfig, initialVehicle, initialPrice]);

  // Recalculate price dynamically in Step 2
  useEffect(() => {
    const pPaint = PAINT_OPTIONS.find((p) => p.id === selectedPaintId)?.price || 1800;
    const pRim = RIM_OPTIONS.find((r) => r.id === selectedRimId)?.price || 3400;
    const pTune = TUNING_OPTIONS.find((t) => t.id === selectedTuningId)?.price || 4200;
    const pAero = AERO_OPTIONS.find((a) => a.id === selectedAeroId)?.price || 6950;
    const pGlow = UNDERGLOW_OPTIONS.find((u) => u.id === selectedUnderglowId)?.price || 450;

    const baseLabour = 1800;
    setEstimatedPrice(pPaint + pRim + pTune + pAero + pGlow + baseLabour);
  }, [selectedPaintId, selectedRimId, selectedTuningId, selectedAeroId, selectedUnderglowId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const chosenPaint = PAINT_OPTIONS.find((p) => p.id === selectedPaintId) || PAINT_OPTIONS[0];
    const chosenRim = RIM_OPTIONS.find((r) => r.id === selectedRimId) || RIM_OPTIONS[0];
    const chosenTune = TUNING_OPTIONS.find((t) => t.id === selectedTuningId) || TUNING_OPTIONS[2];
    const chosenAero = AERO_OPTIONS.find((a) => a.id === selectedAeroId) || AERO_OPTIONS[3];
    const chosenGlow = UNDERGLOW_OPTIONS.find((u) => u.id === selectedUnderglowId) || UNDERGLOW_OPTIONS[1];

    const bookingPayload = {
      name: clientName || 'Verified Patron',
      email: clientEmail || 'client@vertexcustoms.com',
      phone: clientPhone || '+1 (555) 782-9011',
      makeModel,
      year,
      date: requestedDate,
      price: estimatedPrice,
      config: {
        paint: chosenPaint.hex,
        paintName: chosenPaint.name,
        paintType: chosenPaint.type,
        rims: chosenRim.id,
        rimsName: chosenRim.name,
        tint: 'dark-15',
        underglow: chosenGlow.hex,
        underglowPulse: true,
        tuningStage: chosenTune.name,
        aeroKit: chosenAero.name,
        stance: 'Track Stance (-45mm)',
        exhaust: 'Burnt Titanium Quad-Tip Valved',
      },
      notes: notes || `VIN: ${vinNumber}. Condition: ${condition}.`,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.data);
        onBookingCreated(data.data);
        setCurrentStep('confirmed');
      }
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="relative py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-20">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-mono uppercase tracking-wider mb-3">
          <Calendar className="w-3.5 h-3.5" />
          Three-Step Workshop Scheduling
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-['Rajdhani'] uppercase">
          Workshop Bay <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-cyan-400">Reservation</span>
        </h2>
        <p className="text-neutral-400 text-sm mt-1">
          Secure specialized bay allocation, technician assignment, and pre-ordered component readiness.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      {currentStep !== 'confirmed' && (
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[
            { step: 1, label: '1. Machine Description', icon: Car },
            { step: 2, label: '2. Custom Options', icon: Sliders },
            { step: 3, label: '3. Client Telemetry', icon: UserCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isDone = typeof currentStep === 'number' && currentStep > item.step;
            const isCurrent = currentStep === item.step;
            return (
              <div key={item.step} className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isDone
                      ? 'bg-lime-500 text-neutral-950 shadow-[0_0_12px_rgba(132,204,22,0.4)]'
                      : isCurrent
                      ? 'bg-neutral-800 text-lime-400 border border-lime-500 ring-2 ring-lime-500/30'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`hidden sm:inline text-xs font-semibold ${isCurrent ? 'text-white' : 'text-neutral-500'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Multi-Step Box */}
      <div className="relative rounded-3xl bg-neutral-900/90 border border-neutral-800 p-6 md:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* STEP 1: MACHINE DESCRIPTION */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">Step 01 / 03</span>
              <h3 className="text-xl font-bold text-white font-['Rajdhani']">Vehicle Specification</h3>
              <p className="text-xs text-neutral-400">Specify vehicle make, manufacturing year, and baseline mechanical status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Vehicle Make & Model</label>
                <input
                  type="text"
                  required
                  value={makeModel}
                  onChange={(e) => setMakeModel(e.target.value)}
                  placeholder="e.g. Nissan GT-R R35 Nismo"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Year of Manufacture</label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2024"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">VIN / Chassis Identifier</label>
                <input
                  type="text"
                  value={vinNumber}
                  onChange={(e) => setVinNumber(e.target.value)}
                  placeholder="e.g. JN1-R35-VR38-99214"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Current Physical Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Showroom / Pristine OEM">Showroom / Pristine OEM</option>
                  <option value="Minor Surface Blemishes">Minor Surface Blemishes (Requires prep)</option>
                  <option value="Prior Aftermarket Modifications">Prior Aftermarket Modifications</option>
                  <option value="Track Prepared Machine">Track Prepared Machine</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Proceed to Custom Options
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CUSTOM OPTIONS */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono text-lime-400 uppercase tracking-wider block mb-1">Step 02 / 03</span>
              <h3 className="text-xl font-bold text-white font-['Rajdhani']">Modification Architecture Selection</h3>
              <p className="text-xs text-neutral-400">Configure visual finishes, forged wheel designs, aerodynamic wings, and dyno stages.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Paint & Wrap Finish</label>
                <select
                  value={selectedPaintId}
                  onChange={(e) => setSelectedPaintId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-lime-500 focus:outline-none"
                >
                  {PAINT_OPTIONS.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Forged Wheelset</label>
                <select
                  value={selectedRimId}
                  onChange={(e) => setSelectedRimId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-lime-500 focus:outline-none"
                >
                  {RIM_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} - ₹{r.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">ECU Dyno Calibration</label>
                <select
                  value={selectedTuningId}
                  onChange={(e) => setSelectedTuningId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-lime-500 focus:outline-none"
                >
                  {TUNING_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} - ₹{t.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Aerodynamic Package</label>
                <select
                  value={selectedAeroId}
                  onChange={(e) => setSelectedAeroId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-lime-500 focus:outline-none"
                >
                  {AERO_OPTIONS.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} - ₹{a.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Digital Neon Underglow</label>
                <select
                  value={selectedUnderglowId}
                  onChange={(e) => setSelectedUnderglowId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-lime-500 focus:outline-none"
                >
                  {UNDERGLOW_OPTIONS.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} - ₹{u.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              {/* Real-time calculated price pill */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-lime-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">Estimated Build Total</span>
                  <span className="text-xl font-mono font-bold text-lime-400">₹{estimatedPrice.toLocaleString()}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                  Includes Lab Labour
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-neutral-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Proceed to Client Telemetry
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CLIENT TELEMETRY & BOOKING SUBMISSION */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-wider block mb-1">Step 03 / 03</span>
              <h3 className="text-xl font-bold text-white font-['Rajdhani']">Client Contact & Reservation Schedule</h3>
              <p className="text-xs text-neutral-400">Complete registration to receive your cryptographically tracked workshop bay ticket.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Samantha Vance"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="e.g. samantha.vance@velocity.io"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 782-9011"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Requested Bay Admission Date</label>
                <input
                  type="date"
                  required
                  value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-neutral-400 mb-1.5">Bespoke Requests & Engineering Instructions</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specific track requirements, ceramic coating preferences, dyno octane requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:border-fuchsia-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:from-lime-300 hover:to-cyan-300 text-neutral-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(132,204,22,0.4)] transition-all cursor-pointer"
              >
                {submitting ? 'Transmitting Bay Order...' : 'Submit Workshop Reservation'}
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP CONFIRMED: TICKET NUMBER PASS (Screenshot 6 from report) */}
        {currentStep === 'confirmed' && confirmedBooking && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-3xl bg-lime-500/20 border border-lime-500/40 text-lime-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(132,204,22,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-lime-400 block mb-1">
              Admission Pass Issued & Queued
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-white font-['Rajdhani'] uppercase mb-2">
              Workshop Bay Reservation Confirmed
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mb-8">
              Your vehicle has been entered into the active Vertex Command operational queue. An automated admission telemetry token has been generated.
            </p>

            {/* High-tech Boarding Pass Card */}
            <div className="max-w-md mx-auto rounded-2xl bg-neutral-950 border border-neutral-800 p-6 text-left relative overflow-hidden shadow-2xl mb-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Ticket Identifier</span>
                  <span className="text-lg font-mono font-bold text-lime-400 tracking-wider">
                    {confirmedBooking.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Scheduled Date</span>
                  <span className="text-xs font-mono text-white font-medium">
                    {confirmedBooking.date}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">Owner</span>
                  <span className="font-semibold text-neutral-200">{confirmedBooking.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">Machine</span>
                  <span className="font-semibold text-neutral-200">{confirmedBooking.makeModel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">Finishing</span>
                  <span className="font-semibold text-neutral-200">{confirmedBooking.config.paintName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase block font-mono">Estimated Investment</span>
                  <span className="font-mono font-bold text-lime-400">₹{confirmedBooking.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Barcode graphic */}
              <div className="pt-3 border-t border-dashed border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-1 h-7">
                  {[4, 2, 6, 3, 7, 2, 5, 2, 8, 3, 5, 2, 6, 4, 3, 6, 2, 7, 3, 5, 2, 8].map((w, i) => (
                    <span key={i} className="bg-neutral-600 h-full" style={{ width: `${w}px` }} />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  STATUS: {confirmedBooking.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setConfirmedBooking(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Schedule Another Machine
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('admin-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-neutral-950 font-bold text-xs uppercase"
              >
                Track In Command Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
