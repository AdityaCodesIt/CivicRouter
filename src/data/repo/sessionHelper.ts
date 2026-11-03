import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

const GUEST_KEY = 'routewala_is_guest';
let cachedUser: User | null = null;

// Initialize cached user from supabase session if present
if (isSupabaseConfigured) {
  supabase.auth.getSession().then(({ data }) => {
    cachedUser = data.session?.user ?? null;
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    cachedUser = session?.user ?? null;
    if (cachedUser) {
      localStorage.removeItem(GUEST_KEY);
    }
  });
}

export function isGuestMode(): boolean {
  if (!isSupabaseConfigured) return true;
  if (localStorage.getItem(GUEST_KEY) === 'true') return true;
  return cachedUser === null;
}

export function setGuestMode(active: boolean): void {
  if (active) {
    localStorage.setItem(GUEST_KEY, 'true');
    cachedUser = null;
  } else {
    localStorage.removeItem(GUEST_KEY);
  }
}

export async function getActiveUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  if (localStorage.getItem(GUEST_KEY) === 'true') return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    cachedUser = session?.user ?? null;
    return cachedUser;
  } catch {
    return null;
  }
}

export function getCachedUser(): User | null {
  if (localStorage.getItem(GUEST_KEY) === 'true') return null;
  return cachedUser;
}

