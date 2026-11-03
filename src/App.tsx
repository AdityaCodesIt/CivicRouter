/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { RouteProvider } from './context/RouteContext';
import { AppLayout } from './components/layout/AppLayout';
import { PageLoadingFallback } from './components/common/PageLoadingFallback';

// Lazy loaded page components for optimal load performance & code splitting
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const PlanPage = lazy(() =>
  import('./pages/PlanPage').then((m) => ({ default: m.PlanPage }))
);
const RoutePage = lazy(() =>
  import('./pages/RoutePage').then((m) => ({ default: m.RoutePage }))
);
const GoPage = lazy(() =>
  import('./pages/GoPage').then((m) => ({ default: m.GoPage }))
);
const WishlistPage = lazy(() =>
  import('./pages/WishlistPage').then((m) => ({ default: m.WishlistPage }))
);
const SummaryPage = lazy(() =>
  import('./pages/SummaryPage').then((m) => ({ default: m.SummaryPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const DesignSystemPage = lazy(() =>
  import('./pages/DesignSystemPage').then((m) => ({ default: m.DesignSystemPage }))
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouteProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/plan" element={<PlanPage />} />
                  <Route path="/route" element={<RoutePage />} />
                  <Route path="/go" element={<GoPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/summary" element={<SummaryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/design" element={<DesignSystemPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </RouteProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}