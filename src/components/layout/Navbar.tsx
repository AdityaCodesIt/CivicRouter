import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoute } from '../../context/RouteContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../i18n/translations';
import { Sun, Eye, LogIn, LogOut, Moon, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, highContrast, toggleHighContrast, t } = useRoute();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleDarkTheme = () => {
    const isNowDark = !isDark;
    setIsDark(isNowDark);
    if (isNowDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('routewala_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('routewala_theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('routewala_theme');
    const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 24);

      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (winHeight > 0) {
        setScrollProgress((offset / winHeight) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/plan', label: t.nav.plan },
    { to: '/route', label: t.nav.route },
    { to: '/go', label: t.nav.go },
    { to: '/wishlist', label: t.nav.wishlist },
    { to: '/summary', label: t.nav.summary },
    { to: '/settings', label: t.nav.settings },
    { to: '/design', label: 'Design' },
  ];

  const isLanding = location.pathname === '/';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled || !isLanding
          ? 'bg-[#FAF6EF]/90 dark:bg-[#141A18]/90 backdrop-blur-md border-b border-[#E6DECF] dark:border-[#2B3833] shadow-warm-sm py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      {/* Scroll progress bar for storytelling */}
      {isLanding && (
        <div
          className="absolute top-0 left-0 h-[3px] bg-[#F2B84B] transition-all duration-100 ease-out z-50"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
        {/* Brand Wordmark with Winding Route Mark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group whitespace-nowrap shrink-0 text-decoration-none select-none"
        >
          {/* Custom RouteWala Route Line Mark */}
          <div className="w-9 h-9 rounded-xl bg-[#F2B84B] flex items-center justify-center shadow-warm-sm group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M 4 18 C 8 18, 8 6, 12 6 C 16 6, 16 18, 20 18"
                stroke="#1F2A27"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="4" cy="18" r="2.5" fill="#1F2A27" />
              <circle cx="12" cy="6" r="2.5" fill="#3F8F66" />
              <circle cx="20" cy="18" r="2.5" fill="#D9604C" />
            </svg>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#1F2A27] dark:text-[#FAF6EF] group-hover:text-[#E9A92F] transition-colors">
              RouteWala
            </span>
          </div>
        </Link>

        {/* Sliding Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#F2ECE1]/60 dark:bg-[#1C2421]/60 p-1 rounded-full border border-[#E6DECF] dark:border-[#2B3833]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-1.5 text-xs font-body font-medium rounded-full transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#1F2A27] dark:text-[#FAF6EF] font-semibold'
                    : 'text-[#55625D] dark:text-[#95A39D] hover:text-[#1F2A27] dark:hover:text-[#FAF6EF]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-[#FFFDF9] dark:bg-[#25302C] rounded-full shadow-warm-sm border border-[#E6DECF] dark:border-[#384A43]"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Controls: Language, Theme, High Contrast, Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* User Auth State Pill */}
          {user ? (
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFDF9] dark:bg-[#1C2421] border border-[#E6DECF] dark:border-[#2B3833] rounded-full text-xs font-mono shadow-warm-sm">
              <span className="w-2 h-2 rounded-full bg-[#3F8F66]" />
              <span className="truncate max-w-[90px] text-[#1F2A27] dark:text-[#FAF6EF]">
                {user.email?.split('@')[0] || user.phone || 'Rider'}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                title="Sign Out"
                className="hover:text-[#D9604C] cursor-pointer text-[#8A948F] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFDF9] dark:bg-[#1C2421] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] text-[#1F2A27] dark:text-[#FAF6EF] font-body text-xs font-semibold rounded-full border border-[#E6DECF] dark:border-[#2B3833] shadow-warm-sm transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#55625D]" />
              <span>Login</span>
            </Link>
          )}

          {/* Language Switcher Segmented Control */}
          <div className="flex items-center border border-[#E6DECF] dark:border-[#2B3833] rounded-full bg-[#FFFDF9] dark:bg-[#1C2421] p-0.5 text-xs font-body font-medium shadow-warm-sm">
            {(['en', 'hi', 'mr'] as Language[]).map((lng) => (
              <button
                key={lng}
                type="button"
                onClick={() => setLanguage(lng)}
                className={`h-7 px-2.5 rounded-full transition-all cursor-pointer ${
                  language === lng
                    ? 'bg-[#F2B84B] text-[#1F2A27] font-bold shadow-warm-sm'
                    : 'text-[#55625D] dark:text-[#95A39D] hover:text-[#1F2A27]'
                }`}
              >
                {lng === 'en' ? 'EN' : lng === 'hi' ? 'हिंदी' : 'मराठी'}
              </button>
            ))}
          </div>

          {/* Theme Mode Toggle */}
          <button
            type="button"
            onClick={toggleDarkTheme}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="w-8 h-8 rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9] dark:bg-[#1C2421] text-[#55625D] dark:text-[#FAF6EF] hover:bg-[#F2ECE1] dark:hover:bg-[#25302C] flex items-center justify-center transition-colors cursor-pointer shadow-warm-sm"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F2B84B]" /> : <Moon className="w-4 h-4 text-[#55625D]" />}
          </button>

          {/* Daylight High Contrast Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            title="Toggle High Contrast Mode for Sun Glare"
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-warm-sm ${
              highContrast
                ? 'bg-[#1F2A27] text-[#F2B84B] border-[#1F2A27]'
                : 'bg-[#FFFDF9] dark:bg-[#1C2421] text-[#55625D] dark:text-[#FAF6EF] border-[#E6DECF] dark:border-[#2B3833] hover:bg-[#F2ECE1]'
            }`}
            aria-label="Toggle High Contrast"
          >
            <Eye className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Primary CTA (Hidden on mobile) */}
          <Link
            to="/plan"
            className="hidden sm:inline-flex items-center justify-center h-9 px-4 font-body font-bold text-xs rounded-full bg-[#F2B84B] hover:bg-[#E9A92F] text-[#1F2A27] shadow-warm-sm transition-all"
          >
            {t.planMyDay}
          </Link>

          {/* Mobile Hamburger / Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden w-8 h-8 rounded-full border border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9] dark:bg-[#1C2421] text-[#1F2A27] dark:text-[#FAF6EF] flex items-center justify-center shadow-warm-sm cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden border-b border-[#E6DECF] dark:border-[#2B3833] bg-[#FFFDF9]/98 dark:bg-[#1C2421]/98 backdrop-blur-md px-4 py-4 space-y-3 overflow-hidden shadow-warm-md"
          >
            {/* User Auth Section */}
            <div className="p-3 bg-[#FAF6EF] dark:bg-[#141A18] rounded-xl border border-[#E6DECF] dark:border-[#2B3833] flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3F8F66]" />
                    <span className="font-mono text-xs font-semibold text-[#1F2A27] dark:text-[#FAF6EF]">
                      {user.email?.split('@')[0] || user.phone || 'Mumbai Rider'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 bg-[#D9604C]/10 text-[#D9604C] rounded-full font-body text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="font-body text-xs text-[#55625D] dark:text-[#95A39D]">
                    Guest Mode (Offline)
                  </span>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1 bg-[#F2B84B] text-[#1F2A27] rounded-full font-body text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-body text-xs">
              <Link
                to="/plan"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                📝 {t.nav.plan}
              </Link>
              <Link
                to="/route"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                🗺️ {t.nav.route}
              </Link>
              <Link
                to="/go"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                🚀 {t.nav.go} (HUD)
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                ❤️ {t.nav.wishlist}
              </Link>
              <Link
                to="/summary"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                📊 {t.nav.summary}
              </Link>
              <Link
                to="/design"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-[#FAF6EF]/70 dark:bg-[#141A18]/70 border border-[#E6DECF] dark:border-[#2B3833] rounded-xl font-semibold text-[#1F2A27] dark:text-[#FAF6EF]"
              >
                🎨 Design System
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
