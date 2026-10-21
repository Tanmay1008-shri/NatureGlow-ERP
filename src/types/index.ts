export type UserRole = 'admin' | 'lab_tech' | 'customer';

export type ProductStatus = 'Active' | 'In-Development' | 'Concept';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  sku: string;
  status: ProductStatus;
  current_stock: number;
  category: string;
  size: string;
  rating: number;
  reviews_count: number;
  image: string;
  features: string[];
  key_ingredients: string[];
  target_launch?: string;
  cogs_cost: number;
  sustainability_notes: string;
}

export type RawMaterialCategory = 'Upcycled Bio-Waste' | 'Natural Active' | 'Packaging' | 'Emollient';
export type MaterialUnit = 'g' | 'ml' | 'units';

export interface RawMaterial {
  id: string;
  name: string;
  category: RawMaterialCategory;
  unit: MaterialUnit;
  current_stock: number;
  minimum_safety_stock: number;
  cost_per_unit: number; // in USD
  source_partner: string;
  carbon_offset_per_kg: number; // kg CO2e saved vs virgin/synthetic
  notes?: string;
}

export interface FormulationRecipeItem {
  id: string;
  product_id: string;
  raw_material_id: string;
  required_amount_per_unit: number; // in material unit
  notes?: string;
}

export type BatchStatus = 'Sourcing' | 'Production' | 'Pending Safety Clearance' | 'QA' | 'Released';

export interface Batch {
  id: string;
  product_id: string;
  batch_number: string;
  status: BatchStatus;
  quantity_produced: number;
  created_at: string;
  scheduled_completion?: string;
  safety_check_notes: string;
  quality_score?: number; // e.g. 98%
  tested_by?: string;
}

export type OrderStatus = 'Processing' | 'Packaging' | 'Dispatched' | 'Delivered';

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  sku: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  status: OrderStatus;
  created_at: string;
  tracking_code: string;
  items: OrderItem[];
}

export type RNDStage = 'Concept Ideation' | 'Bench Formulation' | 'Microbial Stability Testing' | 'Safety & Clinical Patch' | 'Pilot Batching' | 'Commercial Ready';

export interface RNDProject {
  id: string;
  product_name: string;
  code_name: string;
  stage: RNDStage;
  progress_pct: number;
  allocated_budget: number;
  spent_budget: number;
  lead_scientist: string;
  target_launch: string;
  waste_stream_used: string;
  latest_log: string;
}

export interface WasteCollectionLog {
  id: string;
  waste_type: string;
  source_coop: string;
  location: string;
  quantity_kg: number;
  collected_at: string;
  co2_offset_kg: number;
  processing_yield_pct: number;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  sentiment: 'Positive' | 'Neutral' | 'Critical';
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  created_at: string;
  last_login: string;
}

export interface SecurityAuditEvent {
  id: string;
  timestamp: string;
  actor_email: string;
  actor_role: UserRole | 'guest';
  action: string;
  status: 'ALLOWED' | 'DENIED';
  details: string;
}

