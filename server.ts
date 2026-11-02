import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-Memory Database Stores with realistic seed data
interface BookingConfig {
  paint: string;
  paintName: string;
  paintType: string;
  rims: string;
  rimsName: string;
  tint: string;
  underglow: string;
  underglowPulse: boolean;
  tuningStage: string;
  aeroKit: string;
  stance: string;
  exhaust: string;
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  makeModel: string;
  year: string;
  date: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed';
  progress: number;
  bay: number | null;
  price: number;
  config: BookingConfig;
  notes: string;
  createdAt: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
  price: number;
  supplier: string;
  sku: string;
}

interface PartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  specs: Record<string, string>;
  image: string;
  inStock: boolean;
  compatibleVehicles: string[];
  hpGain: string | null;
  weightReduction: string | null;
  sku: string;
}

interface GalleryProject {
  id: string;
  title: string;
  ownerName: string;
  ownerAvatar: string;
  vehicle: string;
  year: string;
  hp: number;
  torque: string;
  colorName: string;
  colorHex: string;
  underglow: string;
  rims: string;
  image: string;
  installedParts: string[];
  totalCost: number;
  buildTime: string;
  likes: number;
  commentsCount: number;
  category: 'Track Weapon' | 'Street Sleeper' | 'Stance & Show' | 'Cyber Luxury';
  description: string;
}

interface AuditLog {
  id: string;
  eventType: 'BAY_ASSIGNMENT' | 'STATUS_CHANGE' | 'INVENTORY_REORDER' | 'BOOKING_CREATED' | 'PROGRESS_UPDATE';
  message: string;
  timestamp: string;
  actor: string;
  severity: 'info' | 'success' | 'warning';
}

// Initial Seed Bookings (following report schema)
let bookings: Booking[] = [
  {
    id: 'VC-2026-8901',
    name: 'Marcus Vance',
    email: 'marcus.vance@velocity.io',
    phone: '+1 (555) 234-8901',
    makeModel: 'Nissan GT-R R35 Nismo',
    year: '2024',
    date: '2026-10-18',
    status: 'In Progress',
    progress: 75,
    bay: 2,
    price: 18500,
    config: {
      paint: '#84cc16',
      paintName: 'Acid Lime Green',
      paintType: 'Gloss Metallic',
      rims: 'forged-split-bronze',
      rimsName: 'Vertex 20" Forged Split Bronze',
      tint: 'dark-15',
      underglow: '#84cc16',
      underglowPulse: true,
      tuningStage: 'Stage 2 Track (+160 HP)',
      aeroKit: 'Full Widebody Aero',
      stance: 'Track Stance (-45mm)',
      exhaust: 'Burnt Titanium Quad-Tip Valved',
    },
    notes: 'Prioritize downforce balance for Laguna Seca track day next month.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'VC-2026-8902',
    name: 'Elena Rostova',
    email: 'e.rostova@cyberdyn.de',
    phone: '+1 (555) 872-3104',
    makeModel: 'Porsche 911 GT3 RS',
    year: '2025',
    date: '2026-10-21',
    status: 'In Progress',
    progress: 40,
    bay: 1,
    price: 24300,
    config: {
      paint: '#7e22ce',
      paintName: 'Midnight Purple Pearl',
      paintType: 'Chameleon Shift',
      rims: 'carbon-v-spoke',
      rimsName: 'Ultralight Forged Carbon V-Spoke',
      tint: 'violet',
      underglow: '#a855f7',
      underglowPulse: false,
      tuningStage: 'Stage 3 Vertex Beast (+320 HP)',
      aeroKit: 'GT Swan Neck Wing',
      stance: 'Sport Lowered (-25mm)',
      exhaust: 'Inconel F1-Grade Valved Exhaust',
    },
    notes: 'Custom dyno map for 100 octane race blend.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'VC-2026-8903',
    name: 'David Chen',
    email: 'dchen.matrix@apex.org',
    phone: '+1 (555) 419-7603',
    makeModel: 'Toyota GR Supra MK5',
    year: '2023',
    date: '2026-10-24',
    status: 'Approved',
    progress: 10,
    bay: 3,
    price: 14200,
    config: {
      paint: '#06b6d4',
      paintName: 'Cyber Cyan Neon',
      paintType: 'Satin Finish',
      rims: 'deep-dish-black',
      rimsName: '19" Deep Dish Satin Black',
      tint: 'limo-5',
      underglow: '#06b6d4',
      underglowPulse: true,
      tuningStage: 'Stage 1 Street (+85 HP)',
      aeroKit: 'Track Carbon Splitter',
      stance: 'Air-Ride Slammed',
      exhaust: 'Burnt Titanium Quad-Tip Valved',
    },
    notes: 'Install stealth underbody LED routing with app toggle.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'VC-2026-8904',
    name: 'Sophia Sterling',
    email: 'sophia@sterlingmotors.co',
    phone: '+1 (555) 902-1144',
    makeModel: 'BMW M4 Competition G82',
    year: '2024',
    date: '2026-10-27',
    status: 'Pending',
    progress: 0,
    bay: null,
    price: 16800,
    config: {
      paint: '#171717',
      paintName: 'Satin Stealth Black',
      paintType: 'Matte Stealth',
      rims: 'bbs-mesh-silver',
      rimsName: '20" Competition Mesh Hyper-Silver',
      tint: 'dark-15',
      underglow: '#ef4444',
      underglowPulse: false,
      tuningStage: 'Stage 2 Track (+160 HP)',
      aeroKit: 'Track Carbon Splitter',
      stance: 'Sport Lowered (-25mm)',
      exhaust: 'Burnt Titanium Quad-Tip Valved',
    },
    notes: 'Include ceramic coating on new matte vinyl wrap.',
    createdAt: new Date().toISOString(),
  },
];

// Initial Seed Inventory Items (matching report Section 12: P-WRAP-03 Acid Lime Green etc.)
let inventory: InventoryItem[] = [
  {
    id: 'P-WRAP-03',
    name: 'Acid Lime Green Vinyl Roll (Cast 3M)',
    category: 'Vinyl Wrap',
    stock: 2,
    minStock: 3,
    unit: 'Rolls',
    price: 1100,
    supplier: 'Apex Films International',
    sku: 'WRAP-LIME-3M-25M',
  },
  {
    id: 'P-WRAP-07',
    name: 'Midnight Purple Pearl Vinyl Roll',
    category: 'Vinyl Wrap',
    stock: 4,
    minStock: 2,
    unit: 'Rolls',
    price: 1250,
    supplier: 'Inozetek Performance',
    sku: 'WRAP-PURP-INO-25M',
  },
  {
    id: 'P-EXH-01',
    name: 'Titanium Valved Cat-Back Exhaust System',
    category: 'Exhaust',
    stock: 3,
    minStock: 2,
    unit: 'Sets',
    price: 3800,
    supplier: 'Akrapovic Motorsport',
    sku: 'EXH-TI-VALVE-01',
  },
  {
    id: 'P-AERO-04',
    name: 'Dry Pre-Preg Carbon GT Swan Neck Wing',
    category: 'Aero & Carbon',
    stock: 1,
    minStock: 2,
    unit: 'Units',
    price: 2400,
    supplier: 'Voltex Racing Japan',
    sku: 'AERO-SWAN-DRYCF',
  },
  {
    id: 'P-RIM-09',
    name: 'Forged Monoblock 20" Staggered Wheels',
    category: 'Wheels & Rims',
    stock: 5,
    minStock: 2,
    unit: 'Sets',
    price: 4600,
    supplier: 'BBS Motorsport / Vertex',
    sku: 'RIM-FORGE-20STAG',
  },
  {
    id: 'P-TUNE-02',
    name: 'Vertex V-Tuner Gen-4 ECU Flashing Module',
    category: 'Tuning & ECU',
    stock: 8,
    minStock: 4,
    unit: 'Kits',
    price: 1450,
    supplier: 'Vertex Performance Lab',
    sku: 'ECU-VTUNER-G4',
  },
  {
    id: 'P-GLOW-05',
    name: 'Addressable Neon Digital LED Underglow Kit',
    category: 'Lighting & Electrical',
    stock: 6,
    minStock: 3,
    unit: 'Kits',
    price: 420,
    supplier: 'LumenTech Dynamic',
    sku: 'LIGHT-NEON-DIGI4',
  },
  {
    id: 'P-BRK-08',
    name: 'Carbon Ceramic 6-Piston Big Brake Kit',
    category: 'Brakes & Suspension',
    stock: 2,
    minStock: 2,
    unit: 'Sets',
    price: 7900,
    supplier: 'Brembo Racing SpA',
    sku: 'BRK-CERAMIC-6POT',
  },
];

// Comprehensive Parts Catalog Database
let parts: PartItem[] = [
  {
    id: 'part-01',
    name: 'Vertex Titanium Valved Exhaust System',
    category: 'Exhaust',
    price: 3800,
    rating: 4.9,
    reviewsCount: 38,
    description: 'Precision TIG-welded grade-5 titanium cat-back exhaust with wireless dual-valve controller. Produces resonant high-RPM acoustic howl while maintaining drone-free highway cruising.',
    specs: {
      Material: 'Grade 5 Titanium',
      Weight: '8.4 kg (-14.2 kg over OEM)',
      SoundLevel: '108 dB Open / 84 dB Closed',
      Tips: 'Quad 102mm Burnt Flame Finish',
    },
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Toyota GR Supra', 'BMW M4 G82', 'Porsche 911 GT3'],
    hpGain: '+28 HP',
    weightReduction: '-14.2 kg',
    sku: 'VTX-EXH-TI-01',
  },
  {
    id: 'part-02',
    name: 'Vertex Pre-Preg Carbon Fiber Aero Widebody Kit',
    category: 'Aero & Carbon',
    price: 6950,
    rating: 5.0,
    reviewsCount: 22,
    description: 'Autoclave-cured 2x2 twill pre-preg dry carbon widebody system with wind-tunnel validated front canards, vented fenders, side skirts, and aggressive rear diffuser.',
    specs: {
      Material: 'Pre-Preg Dry Carbon Fiber',
      Finish: 'High Gloss UV Clear Coat',
      Downforce: '+180 kg at 200 km/h',
      FenderWidth: '+55mm Front / +70mm Rear',
    },
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Toyota GR Supra', 'BMW M4 G82'],
    hpGain: null,
    weightReduction: '-18.5 kg',
    sku: 'VTX-AERO-WB-CF',
  },
  {
    id: 'part-03',
    name: 'Monoblock Forged 20" Vertex V-Spoke Rims',
    category: 'Wheels & Rims',
    price: 4600,
    rating: 4.8,
    reviewsCount: 45,
    description: 'Forged aerospace 6061-T6 aluminum monoblock wheel engineered for high lateral G track load and maximum brake caliper clearance.',
    specs: {
      Diameter: '20-inch Staggered (20x10.5F / 20x12R)',
      Weight: '8.9 kg per wheel',
      Finish: 'Brushed Satin Bronze or Stealth Black',
      BoltPattern: '5x114.3 / 5x112 / Centerlock',
    },
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Porsche 911 GT3', 'BMW M4 G82', 'Audi RS6'],
    hpGain: null,
    weightReduction: '-12.0 kg rotational',
    sku: 'VTX-RIM-FORGE-20',
  },
  {
    id: 'part-04',
    name: 'Stage 3 Vertex Beast Billet Twin Turbo System',
    category: 'Tuning & ECU',
    price: 8900,
    rating: 4.9,
    reviewsCount: 19,
    description: 'Ball-bearing billet compressor wheels with inconel turbine housings, twin external wastegates, and high-flow charge piping. Engineered for 800+ wheel horsepower.',
    specs: {
      Compressor: 'Point-milled 58mm Billet',
      Cooling: 'Dual Water & Oil Cooled',
      MaxBoost: '2.4 Bar (35 PSI)',
      PowerRating: 'Supports up to 950 BHP',
    },
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Toyota GR Supra', 'BMW M4 G82'],
    hpGain: '+320 HP',
    weightReduction: null,
    sku: 'VTX-TURBO-STG3',
  },
  {
    id: 'part-05',
    name: 'Vertex 3-Way Adjustable Coilover Track Suspension',
    category: 'Brakes & Suspension',
    price: 3600,
    rating: 4.8,
    reviewsCount: 29,
    description: 'Inverted monotube shock absorbers with remote nitrogen canisters. Independent high/low-speed compression and rebound adjustment with front camber plates.',
    specs: {
      Adjustment: '32-Way Rebound / 24-Way Compression',
      SpringRates: '16k Front / 14k Rear Linear',
      HeightDrop: '0mm to -65mm Low',
      Warranty: '2-Year Track Motorsport Warranty',
    },
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Toyota GR Supra', 'BMW M4 G82', 'Porsche 911 GT3'],
    hpGain: null,
    weightReduction: '-6.8 kg',
    sku: 'VTX-SUSP-COIL-3W',
  },
  {
    id: 'part-06',
    name: 'Dynamic Addressable Neon Glass Underglow Lighting',
    category: 'Lighting & Electrical',
    price: 420,
    rating: 4.7,
    reviewsCount: 64,
    description: 'High-density IP68 waterproof flexible silicone optical tubes with smartphone Bluetooth sync, rev-synchronized color breathing, and multi-channel patterns.',
    specs: {
      Voltage: '12V-14.8V Automotive Regulated',
      LEDDensity: '144 LEDs/Meter NeoPixel',
      Weatherproof: 'IP68 Submersible Grade',
      AppControl: 'iOS & Android Low-Latency BLE',
    },
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Universal All Sports Coupes & Sedans'],
    hpGain: null,
    weightReduction: null,
    sku: 'VTX-LIGHT-NEON-V2',
  },
  {
    id: 'part-07',
    name: 'Acid Lime Green Ultra-Gloss Multi-Layer Cast Wrap',
    category: 'Vinyl Wrap',
    price: 1100,
    rating: 4.9,
    reviewsCount: 31,
    description: 'Premium dual-cast automotive wrap film featuring micro-air release adhesive and self-healing clear coat resistant to road debris, UV yellowing, and minor scratches.',
    specs: {
      Thickness: '3.8 Mil Dual Cast',
      Durability: 'Up to 7 Years Exterior',
      RollDimensions: '1.52m x 25m Full Coverage',
      Finish: 'High-Reflective Gloss Metallic',
    },
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Universal Full Body Vehicle Wrap'],
    hpGain: null,
    weightReduction: null,
    sku: 'WRAP-LIME-3M-25M',
  },
  {
    id: 'part-08',
    name: 'Carbon-Silicon Carbide (C/SiC) 400mm Rotor Brake Kit',
    category: 'Brakes & Suspension',
    price: 7900,
    rating: 5.0,
    reviewsCount: 16,
    description: 'Fade-free track braking performance up to 1000°C. 6-piston monoblock front calipers and 4-piston rear calipers with stainless braided lines.',
    specs: {
      Rotors: '400x38mm Front / 380x32mm Rear Ceramic',
      Calipers: 'Forged 6-Pot Monoblock Aluminum',
      Temperature: 'Fade-proof to 1,000°C',
      WeightSaving: '-19.4 kg total unsprung weight',
    },
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    compatibleVehicles: ['Nissan GT-R R35', 'Porsche 911 GT3', 'BMW M4 G82'],
    hpGain: null,
    weightReduction: '-19.4 kg unsprung',
    sku: 'VTX-BRK-CSIC-400',
  },
];

// Custom User Project Galleries (Showcase builds from users & workshop)
let galleryProjects: GalleryProject[] = [
  {
    id: 'gal-01',
    title: 'Apex R35 GT-R Ghost Edition',
    ownerName: 'Kenji Takahashi',
    ownerAvatar: '',
    vehicle: 'Nissan GT-R R35 Track Edition',
    year: '2024',
    hp: 885,
    torque: '1,020 Nm',
    colorName: 'Acid Lime Green',
    colorHex: '#84cc16',
    underglow: 'Neon Lime',
    rims: 'Vertex 20" Forged Bronze',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    installedParts: [
      'Acid Lime Green Multi-Layer Wrap',
      'Stage 3 Billet Twin Turbo (+320 HP)',
      'Titanium Valved Cat-Back Exhaust',
      'Dry Carbon Swan Neck Wing',
      '20" Forged Split Monoblock Rims',
      'Track 3-Way Adjustable Coilovers',
    ],
    totalCost: 28400,
    buildTime: '3 Weeks',
    likes: 142,
    commentsCount: 28,
    category: 'Track Weapon',
    description: 'Built for precision time-attack at Fuji Speedway. Custom-tuned high boost map with dual-valved titanium screamers and active aero balancing.',
  },
  {
    id: 'gal-02',
    title: 'Cyberpunk Supra MK5 Nightcrawler',
    ownerName: 'Renata Silva',
    ownerAvatar: '',
    vehicle: 'Toyota GR Supra 3.0T',
    year: '2023',
    hp: 640,
    torque: '820 Nm',
    colorName: 'Midnight Purple Chameleon',
    colorHex: '#7e22ce',
    underglow: 'Cyber Cyan 144Hz',
    rims: '19" Deep Dish Black',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    installedParts: [
      'Midnight Purple Chameleon Film',
      'Stage 2 Pure800 Hybrid Turbo (+160 HP)',
      'Addressable Neon Underglow Kit',
      'Air-Ride Digital Suspension Kit',
      'Carbon Front Lip & Side Skirts',
      '19" Forged Deep Dish Wheels',
    ],
    totalCost: 19800,
    buildTime: '2.5 Weeks',
    likes: 219,
    commentsCount: 41,
    category: 'Cyber Luxury',
    description: 'Tokyo street cruiser combining slammed air suspension with aggressive 640 HP inline-6 turbo delivery and neon atmospheric glow.',
  },
  {
    id: 'gal-03',
    title: 'Stealth M4 G82 Carbon Shadow',
    ownerName: 'Adrian Croft',
    ownerAvatar: '',
    vehicle: 'BMW M4 Competition G82',
    year: '2024',
    hp: 720,
    torque: '890 Nm',
    colorName: 'Satin Stealth Black',
    colorHex: '#171717',
    underglow: 'Crimson Red',
    rims: '20" Competition Mesh Hyper-Silver',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    installedParts: [
      'Satin Stealth Black Wrap + Ceramic Pro',
      'Stage 2 ECU & TCU Flash (+160 HP)',
      'Dry Carbon Full Aero Package',
      'Titanium Downpipes & Mid-pipe',
      'Carbon Ceramic Brake Upgrade',
    ],
    totalCost: 22600,
    buildTime: '2 Weeks',
    likes: 187,
    commentsCount: 34,
    category: 'Street Sleeper',
    description: 'Blacked-out Autobahn devourer with subtle carbon weave highlights, downpipes, and switchable quad exhaust valves.',
  },
  {
    id: 'gal-04',
    title: 'Neon Weissach 911 GT3 RS',
    ownerName: 'Chloe Dupont',
    ownerAvatar: '',
    vehicle: 'Porsche 911 GT3 RS (992)',
    year: '2025',
    hp: 585,
    torque: '510 Nm',
    colorName: 'Cyber Gold & Acid Lime',
    colorHex: '#eab308',
    underglow: 'Off (Track Spec)',
    rims: 'Forged Magnesium Centerlock',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    installedParts: [
      'Weissach Carbon Wing Risers',
      'Inconel Lightweight Exhaust Manifold',
      'Bespoke Dyno Geometry Alignment',
      'PCCB Ceramic Caliper Refinish in Acid Lime',
      'Roll Cage Padding & Schroth 6-Point Harnesses',
    ],
    totalCost: 31500,
    buildTime: '4 Weeks',
    likes: 312,
    commentsCount: 56,
    category: 'Track Weapon',
    description: 'Nürburgring Nordschleife sub-6:50 record hunter. Stripped down for minimum unsprung weight and razor-sharp throttle response.',
  },
];

// Activity Audit Logs (from Section 10 & 12 of report)
let auditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    eventType: 'BAY_ASSIGNMENT',
    message: 'Assigned Nissan GT-R (VC-2026-8901) to Bay 2 [Paint & Vinyl Wrap].',
    timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Lead Tech Viktor',
    severity: 'info',
  },
  {
    id: 'LOG-002',
    eventType: 'PROGRESS_UPDATE',
    message: 'Updated VC-2026-8901 progress to 75% (Vinyl wrap 90% completed).',
    timestamp: new Date(Date.now() - 3600000 * 2.5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Technician Amol',
    severity: 'success',
  },
  {
    id: 'LOG-003',
    eventType: 'BAY_ASSIGNMENT',
    message: 'Moved Porsche 911 GT3 RS (VC-2026-8902) to Bay 1 [Dyno & ECU Tuning].',
    timestamp: new Date(Date.now() - 3600000 * 1.8).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Lead Tuner Marco',
    severity: 'info',
  },
  {
    id: 'LOG-004',
    eventType: 'STATUS_CHANGE',
    message: 'Approved booking VC-2026-8903 for Toyota GR Supra MK5.',
    timestamp: new Date(Date.now() - 3600000 * 0.9).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Command Admin',
    severity: 'success',
  },
  {
    id: 'LOG-005',
    eventType: 'INVENTORY_REORDER',
    message: 'Auto-flagged low stock alert for P-WRAP-03 (Acid Lime Green Vinyl Roll: 2 / min 3).',
    timestamp: new Date(Date.now() - 3600000 * 0.4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Inventory System',
    severity: 'warning',
  },
];

// API Endpoints
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Vertex Customs Operational Engine', timestamp: new Date().toISOString() });
});

// Bookings
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, count: bookings.length, data: bookings });
});

app.post('/api/bookings', (req, res) => {
  const newBookingData = req.body;
  const ticketNumber = `VC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const booking: Booking = {
    id: ticketNumber,
    name: newBookingData.name || 'Anonymous Customer',
    email: newBookingData.email || 'client@vertexcustoms.com',
    phone: newBookingData.phone || 'N/A',
    makeModel: newBookingData.makeModel || 'Custom Sports Vehicle',
    year: newBookingData.year || '2024',
    date: newBookingData.date || new Date().toISOString().split('T')[0],
    status: 'Pending',
    progress: 0,
    bay: null,
    price: newBookingData.price || 8500,
    config: newBookingData.config || {},
    notes: newBookingData.notes || '',
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(booking);

  // Add audit log
  const newLog: AuditLog = {
    id: `LOG-${Date.now()}`,
    eventType: 'BOOKING_CREATED',
    message: `New booking submitted: ${booking.makeModel} for customer ${booking.name} (${booking.id}).`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Customer Web Portal',
    severity: 'info',
  };
  auditLogs.unshift(newLog);

  res.status(201).json({ success: true, data: booking });
});

app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const bookingIndex = bookings.findIndex((b) => b.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  const prev = bookings[bookingIndex];
  bookings[bookingIndex] = { ...prev, ...updates };

  // Log relevant events
  if (updates.bay !== undefined && updates.bay !== prev.bay) {
    auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      eventType: 'BAY_ASSIGNMENT',
      message: `Reassigned ${prev.makeModel} (${id}) from Bay ${prev.bay ?? 'Unassigned'} to Bay ${updates.bay ?? 'Unassigned'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Command Dashboard',
      severity: 'info',
    });
  }

  if (updates.status && updates.status !== prev.status) {
    auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      eventType: 'STATUS_CHANGE',
      message: `Updated status of ${id} to ${updates.status}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Command Dashboard',
      severity: 'success',
    });
  }

  if (updates.progress !== undefined && updates.progress !== prev.progress) {
    auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      eventType: 'PROGRESS_UPDATE',
      message: `Updated progress of ${id} to ${updates.progress}%.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: 'Workshop Bay Tech',
      severity: 'info',
    });
  }

  res.json({ success: true, data: bookings[bookingIndex] });
});

// Parts Database
app.get('/api/parts', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...parts];

  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// Parts Inventory Control
app.get('/api/inventory', (req, res) => {
  res.json({ success: true, data: inventory });
});

app.post('/api/inventory/reorder', (req, res) => {
  const { id, quantity = 5 } = req.body;
  const item = inventory.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ success: false, error: 'Inventory item not found' });
  }

  item.stock += Number(quantity);

  const newLog: AuditLog = {
    id: `LOG-${Date.now()}`,
    eventType: 'INVENTORY_REORDER',
    message: `Replenished stock for ${item.name} (${item.id}): +${quantity} ${item.unit}. New Stock: ${item.stock}.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Inventory Manager',
    severity: 'success',
  };
  auditLogs.unshift(newLog);

  res.json({ success: true, data: item, log: newLog });
});

// User Project Galleries
app.get('/api/gallery', (req, res) => {
  res.json({ success: true, count: galleryProjects.length, data: galleryProjects });
});

app.post('/api/gallery', (req, res) => {
  const newProjectData = req.body;
  const newProject: GalleryProject = {
    id: `gal-${Date.now()}`,
    title: newProjectData.title || 'Custom Vertex Machine',
    ownerName: newProjectData.ownerName || 'Verified Builder',
    ownerAvatar: newProjectData.ownerAvatar || '',
    vehicle: newProjectData.vehicle || 'Sports Machine',
    year: newProjectData.year || '2024',
    hp: newProjectData.hp || 650,
    torque: newProjectData.torque || '800 Nm',
    colorName: newProjectData.colorName || 'Custom Finish',
    colorHex: newProjectData.colorHex || '#84cc16',
    underglow: newProjectData.underglow || 'Cyan Neon',
    rims: newProjectData.rims || 'Forged Monoblock',
    image:
      newProjectData.image ||
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    installedParts: newProjectData.installedParts || ['Custom Tuning Pack', 'Forged Wheels', 'Aero Styling'],
    totalCost: newProjectData.totalCost || 12000,
    buildTime: newProjectData.buildTime || '2 Weeks',
    likes: 1,
    commentsCount: 0,
    category: newProjectData.category || 'Street Sleeper',
    description: newProjectData.description || 'Custom crafted build at Vertex Customs workshop.',
  };

  galleryProjects.unshift(newProject);
  res.status(201).json({ success: true, data: newProject });
});

app.post('/api/gallery/:id/like', (req, res) => {
  const { id } = req.params;
  const project = galleryProjects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }

  project.likes += 1;
  res.json({ success: true, likes: project.likes });
});

// Audit Logs
app.get('/api/audit-logs', (req, res) => {
  res.json({ success: true, data: auditLogs.slice(0, 30) });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vertex Customs] Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Vertex Customs] Error starting server:', err);
  process.exit(1);
});
