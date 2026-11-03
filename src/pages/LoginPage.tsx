import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { MumbaiSkyline } from '../components/illustrations/MumbaiSkyline';
import {
  Compass,
  ArrowRight,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, signInWithOtp, signInWithOAuth, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already logged in, offer quick jump to planner
  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="soft-card bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <h2 className="font-display font-bold text-2xl text-[var(--color-ink)] mb-1">
            Already Signed In
          </h2>
          <p className="font-mono text-xs text-[var(--color-ink-secondary)] mb-6 truncate">
            {user.email || user.phone}
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="touch"
              fullWidth
              onClick={() => navigate('/plan')}
              icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
            >
              Go to Route Planner
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => navigate('/go')}
            >
              Open Driver Navigator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const { error } = await signInWithOtp(inputVal);
    setLoading(false);

    if (error) {
      setErrorMsg(
        error.message.includes('configured')
          ? 'Supabase backend is not configured yet. You can use Continue as Guest below.'
          : error.message
      );
    } else {
      setSuccessMsg(
        inputVal.includes('@')
          ? 'Check your email inbox for the magic sign-in link!'
          : 'Verification code sent via SMS OTP to your phone!'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { error } = await signInWithOAuth('google');
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    navigate('/plan');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Editorial Branding (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 pr-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-marigold-tint)] text-[#8c5e03] border border-[var(--color-marigold)]/30 rounded-full font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-4 h-4" />
            <span>Transit Access</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-[var(--color-ink)] leading-tight mb-3">
            Your Mumbai day, neatly orchestrated.
          </h1>
          <p className="font-body text-sm text-[var(--color-ink-secondary)] leading-relaxed mb-6">
            Sign in to synchronize multi-stop delivery manifests across devices, preserve errand wishlists, and track earnings seamlessly.
          </p>

          <div className="space-y-3 font-body text-xs text-[var(--color-ink-secondary)] mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--color-sage-deep)] shrink-0" />
              <span>Full privacy: location strictly opt-in</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[var(--color-marigold)] shrink-0" />
              <span>Dadar subway & offline storage ready</span>
            </div>
          </div>

          <div className="opacity-70 mt-6">
            <MumbaiSkyline className="w-full h-auto" />
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7">
          <div className="soft-card bg-[var(--color-surface)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl shadow-md">
            {/* Mobile Header */}
            <div className="text-center lg:text-left mb-6">
              <div className="inline-flex lg:hidden items-center gap-1.5 px-3 py-1 bg-[var(--color-marigold-tint)] text-[#8c5e03] border border-[var(--color-marigold)]/30 rounded-full font-mono text-xs font-semibold uppercase tracking-wider mb-3">
                <Compass className="w-4 h-4" />
                <span>Transit Access</span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[var(--color-ink)]">
                Sign In to RouteWala
              </h2>
              <p className="font-body text-xs text-[var(--color-ink-secondary)] mt-1">
                Enter your mobile number or email to receive a secure login code
              </p>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3.5 bg-[var(--color-priority-high-bg)] border border-[var(--color-priority-high)] text-[var(--color-priority-high)] rounded-xl flex items-start gap-2.5 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 bg-[var(--color-sage-tint)] border border-[var(--color-sage)] text-[var(--color-sage-deep)] rounded-xl flex items-start gap-2.5 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* OTP / Magic Link Form */}
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-body font-semibold text-[var(--color-ink-secondary)] mb-1.5">
                  Mobile Number or Email
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="+91 98200 12345 or rider@example.com"
                  required
                  className="w-full h-12 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] font-mono text-sm placeholder:text-[var(--color-ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-marigold)] focus:border-transparent transition-all"
                />
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-1.5 font-body">
                  Indian numbers (+91) receive SMS OTP; email addresses receive a magic login link.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="touch"
                fullWidth
                disabled={loading}
                icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
              >
                {loading ? 'Sending Code...' : 'Send Login Code / Link'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border)]" />
              </div>
              <span className="relative bg-[var(--color-surface)] px-3 text-[11px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wider">
                Or Continue With
              </span>
            </div>

            {/* Social & Guest Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-12 px-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-bg-sunken)] text-[var(--color-ink)] font-body font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={handleGuestContinue}
                className="w-full h-12 px-4 rounded-full bg-[#1F2A27] hover:bg-[#2C3B37] text-[#F2B84B] dark:bg-[#25322D] dark:text-[#F2B84B] dark:border dark:border-[#F2B84B]/40 dark:hover:bg-[#2E3D37] font-body font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F2B84B]" />
                <span>Continue as Guest (Offline LocalStorage)</span>
              </button>
            </div>

            {/* Guest Mode Explainer Notice */}
            <div className="mt-5 p-3.5 bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl text-center">
              <p className="text-[11px] font-body text-[var(--color-ink-muted)] leading-relaxed">
                Guest mode runs locally on your device with no remote database required. You can sign in anytime later to import your stops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};