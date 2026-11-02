export interface BookingConfig {
  paint: string;
  paintName: string;
  paintType: 'Gloss' | 'Matte' | 'Satin' | 'Metallic' | 'Chameleon' | 'Gloss Metallic';
  rims: string;
  rimsName: string;
  tint: string;
  tintName: string;
  underglow: string;
  underglowPulse: boolean;
  tuningStage: string;
  aeroKit: string;
  stance: string;
  exhaust: string;
}

export interface Booking {
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

export interface InventoryItem {
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

export interface PartItem {
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

export interface GalleryProject {
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
  hasLiked?: boolean;
  commentsCount: number;
  category: 'Track Weapon' | 'Street Sleeper' | 'Stance & Show' | 'Cyber Luxury';
  description: string;
}

export interface AuditLog {
  id: string;
  eventType: 'BAY_ASSIGNMENT' | 'STATUS_CHANGE' | 'INVENTORY_REORDER' | 'BOOKING_CREATED' | 'PROGRESS_UPDATE';
  message: string;
  timestamp: string;
  actor: string;
  severity: 'info' | 'success' | 'warning';
}

export interface VehiclePreset {
  id: string;
  name: string;
  category: string;
  baseHp: number;
  baseTorque: string;
  topSpeed: string;
  accel: string;
  basePrice: number;
}
