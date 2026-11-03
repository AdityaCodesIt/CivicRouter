import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { RoutePlan } from './types';
import { getActiveUser, isGuestMode } from './sessionHelper';

const STORAGE_PLANS_KEY = 'routewala_plans_v1';

function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getLocalPlans(): RoutePlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_PLANS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalPlans(plans: RoutePlan[]) {
  try {
    localStorage.setItem(STORAGE_PLANS_KEY, JSON.stringify(plans));
  } catch {}
}

/**
 * Creates a new route plan
 */
export async function createPlan(data: Partial<RoutePlan>): Promise<RoutePlan> {
  const user = await getActiveUser();
  const today = getTodayDateString();

  const newPlan: RoutePlan = {
    id: data.id || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: user?.id,
    title: data.title || 'Mumbai Central Corridor Run',
    plan_date: data.plan_date || today,
    status: data.status || 'active',
    strict_priority: data.strict_priority ?? false,
    total_km: data.total_km ?? 0,
    total_min: data.total_min ?? 0,
    earnings: data.earnings ?? 0,
    started_at: data.started_at || new Date().toISOString(),
    ended_at: data.ended_at || null,
  };

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    const local = getLocalPlans();
    local.unshift(newPlan);
    saveLocalPlans(local);
    return newPlan;
  }

  // Supabase insert
  const { data: inserted, error } = await supabase
    .from('route_plans')
    .insert({
      title: newPlan.title,
      plan_date: newPlan.plan_date,
      status: newPlan.status,
      strict_priority: newPlan.strict_priority,
      total_km: newPlan.total_km,
      total_min: newPlan.total_min,
      earnings: newPlan.earnings,
      started_at: newPlan.started_at,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.warn('Failed to insert route_plan to Supabase, falling back to local:', error);
    const local = getLocalPlans();
    local.unshift(newPlan);
    saveLocalPlans(local);
    return newPlan;
  }

  return inserted;
}

/**
 * Gets or initializes the active route plan for today
 */
export async function getTodayPlan(_userId?: string): Promise<RoutePlan> {
  const user = await getActiveUser();
  const today = getTodayDateString();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    const local = getLocalPlans();
    let todayPlan = local.find((p) => p.plan_date === today);
    if (!todayPlan) {
      todayPlan = {
        id: `plan-guest-${today}`,
        title: 'Mumbai Central Corridor Run',
        plan_date: today,
        status: 'active',
        strict_priority: false,
        total_km: 18.5,
        total_min: 145,
        earnings: 580,
        started_at: new Date().toISOString(),
        ended_at: null,
      };
      local.unshift(todayPlan);
      saveLocalPlans(local);
    }
    return todayPlan;
  }

  // Fetch today's plan from Supabase
  const { data, error } = await supabase
    .from('route_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('plan_date', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Create today plan in Supabase
    return createPlan({
      title: 'Mumbai Central Corridor Run',
      plan_date: today,
      status: 'active',
      strict_priority: false,
    });
  }

  return data;
}

/**
 * Lists all past and current route plans for user
 */
export async function listPlans(_userId?: string): Promise<RoutePlan[]> {
  const user = await getActiveUser();

  if (!user || isGuestMode() || !isSupabaseConfigured) {
    const local = getLocalPlans();
    if (local.length === 0) {
      // Seed an initial demo run for summary history
      const initial: RoutePlan = {
        id: 'plan-demo-yesterday',
        title: 'South Mumbai Express Run',
        plan_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        status: 'completed',
        strict_priority: false,
        total_km: 24.2,
        total_min: 180,
        earnings: 720,
        started_at: new Date(Date.now() - 86400000).toISOString(),
        ended_at: new Date(Date.now() - 86400000 + 4 * 3600000).toISOString(),
      };
      local.push(initial);
      saveLocalPlans(local);
    }
    return local;
  }

  const { data, error } = await supabase
    .from('route_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('plan_date', { ascending: false });

  if (error) {
    console.warn('Error fetching plans from Supabase:', error);
    return getLocalPlans();
  }

  return data || [];
}

