export type PriorityLevel = 'high' | 'medium' | 'low';
export type StopType = 'single' | 'pickup' | 'drop';
export type DbStopStatus = 'pending' | 'delivered' | 'failed' | 'skipped';
export type UiStopStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export type ErrandCategory =
  | 'shop'
  | 'pharmacy'
  | 'atm'
  | 'food'
  | 'fuel'
  | 'restroom'
  | 'water'
  | 'other';

export type WishlistStatus = 'open' | 'added' | 'done' | 'dismissed';

export interface RoutePlan {
  id: string;
  user_id?: string;
  title: string;
  plan_date: string;
  status: 'draft' | 'active' | 'completed';
  strict_priority: boolean;
  total_km: number;
  total_min: number;
  earnings: number;
  started_at: string | null;
  ended_at: string | null;
  created_at?: string;
}

export interface StopRecord {
  id: string;
  plan_id?: string;
  user_id?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  priority: PriorityLevel;
  deadline?: string | null;
  type: StopType;
  pair_id?: string | null;
  phone?: string | null;
  cod_amount: number;
  note?: string | null;
  sequence: number;
  eta: number;
  status: DbStopStatus;
  fail_reason?: string | null;
  completed_at?: string | null;
  // Extra client-convenience fields preserved in guest mode & UI
  area?: string;
  landmark?: string;
  parcel_count?: number;
}

export interface WishlistItemRecord {
  id: string;
  user_id?: string;
  text: string;
  category: ErrandCategory;
  place_name: string;
  lat: number;
  lng: number;
  detour_budget_min: number;
  status: WishlistStatus;
  // UI helpers
  area?: string;
  landmark?: string;
  distance_off_route_meters?: number;
  detour_minutes?: number;
  rating?: number;
  is_pinned?: boolean;
}

export interface WishlistPromptRecord {
  id?: string;
  user_id?: string;
  plan_id?: string | null;
  item_id: string;
  detour_m: number;
  detour_min: number;
  action: 'added' | 'dismissed' | 'ignored';
  shown_at?: string;
}

export interface UserSettingsRecord {
  user_id?: string;
  strict_priority: boolean;
  detour_budget_min: number;
  daily_detour_budget_min: number;
  max_alerts_per_day: number;
  quiet_mode: boolean;
  high_contrast: boolean;
  text_size: 'normal' | 'large' | 'xl';
  location_opt_in: boolean;
  // Profile settings
  display_name?: string;
  language?: 'en' | 'hi' | 'mr';
  vehicle_type?: 'motorcycle' | 'scooter' | 'ev' | 'bicycle';
  rate_per_stop?: number;
  cod_bonus_percent?: number;
  fuel_allowance_per_km?: number;
}

