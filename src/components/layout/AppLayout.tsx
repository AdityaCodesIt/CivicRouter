import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { OfflineBanner } from '../common/OfflineBanner';
import { GuestDataImportPrompt } from '../common/GuestDataImportPrompt';
import { ErrorBoundary } from '../common/ErrorBoundary';
import { useRoute } from '../../context/RouteContext';
import { MapPin, Navigation, ListOrdered, Heart, Sliders } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { t } = useRoute();

  const isDriverMode = location.pathname === '/go';

  // Mobile bottom tab bar items
  const tabs = [
    { to: '/plan', label: t.nav.plan, icon: MapPin },
    { to: '/route', label: t.nav.route, icon: ListOrdered },
    { to: '/go', label: t.nav.go, icon: Navigation },
    { to: '/wishlist', label: t.nav.wishlist, icon: Heart },
    { to: '/settings', label: t.nav.settings, icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] dark:bg-[#141A18] text-[#1F2A27] dark:text-[#FAF6EF] relative transition-colors duration-300">
      {/* Subtle Paper Grain Overlay (3% opacity) */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.025] mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Top Navbar */}
      <Navbar />

      {/* Offline Status & Pending Sync Banner */}
      <OfflineBanner />

      {/* Guest Data Import Banner if applicable */}
      <GuestDataImportPrompt />

      {/* Main Content with Route Page Transition */}
      <main className="flex-1 pb-28 md:pb-12 max-w-[1180px] w-full mx-auto px-3.5 sm:px-6 md:px-8">
        <ErrorBoundary key={location.pathname}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      {/* Mobile Floating Bottom Bar (hidden in driver HUD mode /go for maximum screen space) */}
      {!isDriverMode && (
        <nav
          aria-label="Mobile Navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 dark:bg-[#1C2421]/95 backdrop-blur-md border-t border-[#E6DECF] dark:border-[#2B3833] shadow-warm-lg pb-[max(0.35rem,env(safe-area-inset-bottom,0px))] px-2 select-none"
        >
          <div className="grid grid-cols-5 h-14 items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.to;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`relative flex flex-col items-center justify-center py-1 transition-colors select-none min-h-[52px] ${
                    isActive
                      ? 'text-[#1F2A27] dark:text-[#FAF6EF]'
                      : 'text-[#8A948F] hover:text-[#1F2A27] dark:hover:text-[#FAF6EF]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-tab-pill"
                      className="absolute inset-0 bg-[#FBEBC6] dark:bg-[#25302C] rounded-full shadow-warm-sm border border-[#F2B84B]/40"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    />
                  )}
                  <Icon className="relative z-10 w-4 h-4 stroke-[2]" />
                  <span className="relative z-10 text-[10px] font-body font-semibold mt-0.5 truncate max-w-[58px]">
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
