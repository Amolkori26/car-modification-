import { VehiclePreset, InventoryItem, PartItem, GalleryProject, Booking } from '../types';

export const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    id: 'gtr-r35',
    name: 'Nissan GT-R R35 Nismo',
    category: 'Supercar Killer',
    baseHp: 600,
    baseTorque: '652 Nm',
    topSpeed: '330 km/h',
    accel: '2.8s (0-100)',
    basePrice: 12000,
  },
  {
    id: 'supra-mk5',
    name: 'Toyota GR Supra MK5 3.0T',
    category: 'Turbo Coupe',
    baseHp: 382,
    baseTorque: '500 Nm',
    topSpeed: '250 km/h',
    accel: '3.9s (0-100)',
    basePrice: 8500,
  },
  {
    id: 'gt3-rs',
    name: 'Porsche 911 GT3 RS (992)',
    category: 'Track Precision',
    baseHp: 518,
    baseTorque: '465 Nm',
    topSpeed: '296 km/h',
    accel: '3.0s (0-100)',
    basePrice: 18500,
  },
  {
    id: 'm4-g82',
    name: 'BMW M4 Competition G82',
    category: 'Sport Gran Coupe',
    baseHp: 503,
    baseTorque: '650 Nm',
    topSpeed: '290 km/h',
    accel: '3.4s (0-100)',
    basePrice: 10500,
  },
];

export const PAINT_OPTIONS = [
  { id: 'acid-lime', name: 'Acid Lime Green', hex: '#84cc16', type: 'Gloss Metallic' as const, glow: 'rgba(132, 204, 22, 0.45)', tag: 'Signature', price: 1800 },
  { id: 'midnight-purple', name: 'Midnight Purple Pearl', hex: '#7e22ce', type: 'Chameleon' as const, glow: 'rgba(126, 34, 206, 0.45)', tag: 'Iconic', price: 2400 },
  { id: 'cyber-gold', name: 'Cyber Gold Liquid', hex: '#eab308', type: 'Metallic' as const, glow: 'rgba(234, 179, 8, 0.45)', tag: 'Exclusive', price: 2200 },
  { id: 'satin-black', name: 'Satin Stealth Black', hex: '#1c1917', type: 'Satin' as const, glow: 'rgba(50, 50, 50, 0.45)', tag: 'Stealth', price: 1950 },
  { id: 'nardo-grey', name: 'Nardo Grey Clear', hex: '#64748b', type: 'Gloss' as const, glow: 'rgba(100, 116, 139, 0.45)', tag: 'Track', price: 1750 },
  { id: 'apex-red', name: 'Apex Crimson Red', hex: '#dc2626', type: 'Gloss Metallic' as const, glow: 'rgba(220, 38, 38, 0.45)', tag: 'Motorsport', price: 1900 },
  { id: 'hyper-blue', name: 'Hyper Electric Blue', hex: '#2563eb', type: 'Metallic' as const, glow: 'rgba(37, 99, 235, 0.45)', tag: 'Neon', price: 2100 },
];

export const RIM_OPTIONS = [
  { id: 'forged-split-bronze', name: '20" Forged Split Bronze', color: '#b45309', style: 'Split 5-Spoke', weight: '-3.2kg', price: 3400 },
  { id: 'deep-dish-black', name: '19" Deep Dish Satin Black', color: '#18181b', style: 'Dish Step-Lip', weight: '-2.5kg', price: 2900 },
  { id: 'bbs-mesh-silver', name: '20" Competition Mesh Silver', color: '#e2e8f0', style: 'Multi-Mesh BBS', weight: '-3.8kg', price: 3800 },
  { id: 'aero-carbon', name: '20" Carbon Turbofan Aero', color: '#09090b', style: 'Carbon Blade Aerodisc', weight: '-4.6kg', price: 4900 },
];

export const TINT_OPTIONS = [
  { id: 'clear', name: 'Factory Clear (70% VLT)', opacity: 0.15, color: '#38bdf8', price: 0 },
  { id: 'light-35', name: 'Track Smoke (35% VLT)', opacity: 0.45, color: '#0f172a', price: 450 },
  { id: 'dark-15', name: 'Ceramic Dark (15% VLT)', opacity: 0.72, color: '#020617', price: 650 },
  { id: 'limo-5', name: 'Executive Limo (5% VLT)', opacity: 0.88, color: '#000000', price: 800 },
  { id: 'violet', name: 'Chameleon Violet UV (20% VLT)', opacity: 0.65, color: '#581c87', price: 950 },
];

export const UNDERGLOW_OPTIONS = [
  { id: 'off', name: 'Off (Stealth Mode)', hex: 'transparent', glow: 'none', price: 0 },
  { id: 'lime', name: 'Acid Lime Pulse', hex: '#84cc16', glow: '0 12px 28px rgba(132, 204, 22, 0.85)', price: 450 },
  { id: 'cyan', name: 'Cyber Cyan 144Hz', hex: '#06b6d4', glow: '0 12px 28px rgba(6, 182, 212, 0.85)', price: 450 },
  { id: 'purple', name: 'Neon Ultraviolet', hex: '#a855f7', glow: '0 12px 28px rgba(168, 85, 247, 0.85)', price: 450 },
  { id: 'amber', name: 'Solar Amber Burst', hex: '#f59e0b', glow: '0 12px 28px rgba(245, 158, 11, 0.85)', price: 450 },
  { id: 'red', name: 'Track Demon Red', hex: '#ef4444', glow: '0 12px 28px rgba(239, 68, 68, 0.85)', price: 450 },
];

export const TUNING_OPTIONS = [
  { id: 'stock', name: 'OEM Stock Tuning', hp: 0, torque: '+0 Nm', sound: 'Quiet OEM', price: 0 },
  { id: 'stage1', name: 'Stage 1 Street (+85 HP)', hp: 85, torque: '+110 Nm', sound: 'Throaty Intake & Valve', price: 1850 },
  { id: 'stage2', name: 'Stage 2 Track (+160 HP)', hp: 160, torque: '+210 Nm', sound: 'Crisp Downpipes & Pop Overrun', price: 4200 },
  { id: 'stage3', name: 'Stage 3 Vertex Beast (+320 HP)', hp: 320, torque: '+380 Nm', sound: 'Twin Billet Screamer & Anti-Lag', price: 8900 },
];

export const AERO_OPTIONS = [
  { id: 'stock', name: 'OEM Factory Body', downforce: 'Base Aerodynamics', price: 0 },
  { id: 'splitter', name: 'Track Carbon Front Splitter & Canards', downforce: '+60 kg @ 180 km/h', price: 1600 },
  { id: 'gt-wing', name: 'GT Dry Carbon Swan Neck Wing', downforce: '+140 kg @ 180 km/h', price: 2800 },
  { id: 'widebody', name: 'Full Pre-Preg Carbon Widebody + Aero Pack', downforce: '+240 kg @ 180 km/h', price: 6950 },
];

export const STANCE_OPTIONS = [
  { id: 'stock', name: 'Factory Height (Standard Clearance)', dropMm: 0, price: 0 },
  { id: 'sport', name: 'Sport Progressive Lowering (-25mm)', dropMm: 25, price: 850 },
  { id: 'track', name: 'Track Stance Monotube (-45mm)', dropMm: 45, price: 2400 },
  { id: 'air-ride', name: 'Digital 3H Air-Ride Slammed (-70mm)', dropMm: 70, price: 4500 },
];

export const WORKSHOP_BAYS = [
  { id: 1, name: 'Bay 1: Dyno & ECU Tuning', specialty: 'High-speed rolling dyno, ECU remaps, boost calibration', tech: 'Marco Bellini' },
  { id: 2, name: 'Bay 2: Paint & Vinyl Wrap', specialty: 'Climate-controlled cleanroom, multi-stage wraps, ceramic coat', tech: 'Viktor Kane' },
  { id: 3, name: 'Bay 3: Aero & Forged Wheels', specialty: 'Dry carbon fitment, suspension coilovers, wheel alignment', tech: 'Amol Kori' },
  { id: 4, name: 'Bay 4: Electrical & Underglow', specialty: 'Addressable neon routing, CAN-bus telemetry, custom wiring', tech: 'Leo Santos' },
];
