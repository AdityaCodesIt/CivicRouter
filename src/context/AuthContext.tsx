import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isGuestMode, setGuestMode } from '../data/repo/sessionHelper';
import { getLocalStops } from '../data/repo/stops';
import { getLocalWishlist } from '../data/repo/wishlist';
import { createPlan } from '../data/repo/plans';
import { initialDeliveryStops } from '../data/mockStops';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  hasGuestDataToImport: boolean;
  signInWithOtp: (emailOrPhone: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  importGuestData: () => Promise<{ success: boolean; count: number }>;
  dismissGuestImport: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuestState] = useState<boolean>(() => isGuestMode());
  const [hasGuestDataToImport, setHasGuestDataToImport] = useState(false);

  // Check if local guest data differs from defaults
  const checkForGuestData = (currentUser: User | null) => {
    if (!currentUser) {
      setHasGuestDataToImport(false);
      return;
    }
    const local = getLocalStops();
    const hasCustomLocalData =
      local.length > 0 &&
      localStorage.getItem('routewala_v1_state_stops') !== null &&
      localStorage.getItem('routewala_guest_imported') !== 'true';

    setHasGuestDataToImport(hasCustomLocalData);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsGuestState(true);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsGuestState(false);
        setGuestMode(false);
        checkForGuestData(currentSession.user);
      } else {
        setIsGuestState(isGuestMode());
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setIsGuestState(false);
        setGuestMode(false);
        checkForGuestData(newSession.user);
      } else {
        setIsGuestState(isGuestMode());
        setHasGuestDataToImport(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (emailOrPhone: string): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Supabase is not configured yet. Please check .env settings or continue as guest.'),
      };
    }

    const trimmed = emailOrPhone.trim();
    if (trimmed.includes('@')) {
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      return { error: error as Error | null };
    } else {
      // Format Indian phone number
      const digitsOnly = trimmed.replace(/\D/g, '');
      const formattedPhone = digitsOnly.startsWith('91') && digitsOnly.length === 12
        ? `+${digitsOnly}`
        : digitsOnly.length === 10
        ? `+91${digitsOnly}`
        : `+${digitsOnly}`;

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      return { error: error as Error | null };
    }
  };

  const signInWithOAuth = async (provider: 'google'): Promise<{ error: Error | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Supabase is not configured yet. Please check .env settings or continue as guest.'),
      };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setUser(null);
    setIsGuestState(true);
    setGuestMode(true);
    setHasGuestDataToImport(false);
  };

  const continueAsGuest = (): void => {
    setGuestMode(true);
    setIsGuestState(true);
    setHasGuestDataToImport(false);
  };

  const dismissGuestImport = (): void => {
    setHasGuestDataToImport(false);
    localStorage.setItem('routewala_guest_imported', 'true');
  };

  const importGuestData = async (): Promise<{ success: boolean; count: number }> => {
    if (!user || !isSupabaseConfigured) {
      return { success: false, count: 0 };
    }

    try {
      const localStops = getLocalStops();
      const localWishlist = getLocalWishlist();

      // Create new active plan for user
      const plan = await createPlan({
        title: 'Imported Guest Corridor Run',
        status: 'active',
        plan_date: new Date().toISOString().split('T')[0],
      });

      // Insert all local stops
      if (localStops.length > 0) {
        const stopRows = localStops.map((s, idx) => ({
          plan_id: plan.id,
          user_id: user.id,
          name: s.recipientName,
          address: `${s.address}, ${s.area || ''}`,
          lat: s.coordinates?.lat || 19.0178,
          lng: s.coordinates?.lng || 72.8428,
          priority: s.priority,
          type: s.type,
          sequence: idx + 1,
          eta: s.etaMinutes || 15,
          status: s.status === 'completed' ? 'delivered' : 'pending',
          phone: s.phone,
          cod_amount: s.codAmount || 0,
          note: s.notes,
        }));

        await supabase.from('stops').insert(stopRows);
      }

      // Insert local wishlist
      if (localWishlist.length > 0) {
        const wishlistRows = localWishlist.map((w) => ({
          user_id: user.id,
          text: w.name,
          category: w.category === 'chai' ? 'food' : w.category,
          place_name: w.landmark,
          lat: w.coordinates?.lat || 19.018,
          lng: w.coordinates?.lng || 72.842,
          detour_budget_min: w.detourBudgetMinutes || 5,
          status: 'open',
        }));

        await supabase.from('wishlist_items').insert(wishlistRows);
      }

      // Mark imported and clear local storage stops
      localStorage.setItem('routewala_guest_imported', 'true');
      localStorage.removeItem('routewala_v1_state_stops');
      localStorage.removeItem('routewala_v1_state_completed');
      localStorage.removeItem('routewala_v1_state_wishlist');
      setHasGuestDataToImport(false);

      return { success: true, count: localStops.length };
    } catch (err) {
      console.error('Failed to import guest data to Supabase:', err);
      return { success: false, count: 0 };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isGuest,
        hasGuestDataToImport,
        signInWithOtp,
        signInWithOAuth,
        signOut,
        continueAsGuest,
        importGuestData,
        dismissGuestImport,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

