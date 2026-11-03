import React from 'react';
import { Link } from 'react-router-dom';
import { useRoute } from '../context/RouteContext';
import { Button } from '../components/common/Button';
import { Reveal } from '../motion/Reveal';
import { Stagger, StaggerItem } from '../motion/Stagger';
import { useCountUp } from '../motion/useCountUp';
import { PhoneMockupIllustration } from '../components/illustrations/PhoneMockupIllustration';
import { MumbaiSkyline } from '../components/illustrations/MumbaiSkyline';
import { DottedDivider } from '../components/illustrations/DottedDivider';
import {
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Compass,
  Utensils,
  PhoneCall,
  CloudRain,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Smartphone,
  Eye,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t } = useRoute();

  const countMins = useCountUp(42, 1.6);
  const countRadius = useCountUp(150, 1.8);
  const countOffline = useCountUp(100, 1.5);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-bg)] to-[var(--color-bg-sunken)]/40 py-12 md:py-20 px-4 md:px-8 overflow-hidden border-b border-[var(--color-border)]">
        {/* Subtle warm morning background grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7">
              <Reveal variant="fadeUp">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] rounded-full font-mono text-xs font-medium uppercase tracking-wider mb-5 shadow-sm">
                  <Compass className="w-4 h-4 text-[#8c5e03]" />
                  <span>{t.heroBadge}</span>
                </div>
              </Reveal>

              {/* Display Headline */}
              <Reveal variant="fadeUp" delay={0.1}>
                <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-[var(--color-ink)] tracking-tight leading-[1.08] mb-6 [text-wrap:balance]">
                  {t.heroHeadline}
                </h1>
              </Reveal>

              {/* Subtitle */}
              <Reveal variant="fadeUp" delay={0.2}>
                <p className="font-body text-base sm:text-lg text-[var(--color-ink-secondary)] leading-relaxed max-w-2xl mb-8">
                  {t.heroSubtitle}
                </p>
              </Reveal>

              {/* Primary & Secondary CTAs */}
              <Reveal variant="fadeUp" delay={0.3}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <Link to="/plan">
                    <Button
                      variant="primary"
                      size="touch"
                      icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
                    >
                      {t.planMyDay}
                    </Button>
                  </Link>

                  <Link to="/design">
                    <Button variant="secondary" size="touch">
                      {t.exploreDesign}
                    </Button>
                  </Link>
                </div>
              </Reveal>

              {/* Ergonomics & Privacy Chips */}
              <Reveal variant="fadeUp" delay={0.4}>
                <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center gap-y-2.5 gap-x-6 text-xs font-body text-[var(--color-ink-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-sage-deep)]" />
                    <span>Client-side local storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-marigold)]" />
                    <span>56px touch ergonomics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-apricot)]" />
                    <span>English · हिंदी · मराठी</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Hero Right: Live Interactive Phone Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <Reveal variant="scaleIn" delay={0.25} className="w-full max-w-sm">
                <PhoneMockupIllustration className="w-full drop-shadow-xl" />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP WITH LIVE COUNT-UP */}
      <section className="py-8 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            <div className="p-3">
              <div className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] tabular-nums">
                ~<span ref={countMins.ref}>{countMins.value}</span>m
              </div>
              <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1 font-medium">
                Average saved per shift
              </div>
            </div>

            <div className="p-3">
              <div className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-sage-deep)] tabular-nums">
                ≤<span ref={countRadius.ref}>{countRadius.value}</span>m
              </div>
              <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1 font-medium">
                Zero-detour errand radius
              </div>
            </div>

            <div className="p-3">
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#8c5e03] tabular-nums">
                <span ref={countOffline.ref}>{countOffline.value}</span>%
              </div>
              <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1 font-medium">
                Offline Dadar subway ready
              </div>
            </div>

            <div className="p-3">
              <div className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)]">
                3
              </div>
              <div className="font-body text-xs text-[var(--color-ink-secondary)] mt-1 font-medium">
                Local Mumbai languages
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM (3 Mumbai-flavoured Scenarios) */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <div className="mb-12">
            <span className="font-mono text-xs font-semibold text-[var(--color-priority-high)] uppercase tracking-wider mb-2 block">
              Ground Reality Research
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight mb-4">
              {t.problem.title}
            </h2>
            <p className="font-body text-base text-[var(--color-ink-secondary)] max-w-2xl">
              {t.problem.subtitle}
            </p>
          </div>

          {/* 3 Soft Asymmetric Story Cards */}
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <StaggerItem>
              <div className="soft-card p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 mb-5 rounded-2xl bg-[var(--color-priority-high-bg)] text-[var(--color-priority-high)] flex items-center justify-center">
                    <CloudRain className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide mb-1">
                    Scenario 01 · Monsoon
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--color-ink)] mb-3 leading-snug">
                    {t.problem.card1Title}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    {t.problem.card1Text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-border)] font-mono text-xs font-medium text-[var(--color-priority-high)]">
                  Result: 35 mins lost to wet pull-overs
                </div>
              </div>
            </StaggerItem>

            {/* Card 2 */}
            <StaggerItem>
              <div className="soft-card p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 mb-5 rounded-2xl bg-[var(--color-marigold-tint)] text-[#8c5e03] flex items-center justify-center">
                    <Utensils className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide mb-1">
                    Scenario 02 · Pitstop
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--color-ink)] mb-3 leading-snug">
                    {t.problem.card2Title}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    {t.problem.card2Text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-border)] font-mono text-xs font-medium text-[#8c5e03]">
                  Result: Skipped lunch & dehydration
                </div>
              </div>
            </StaggerItem>

            {/* Card 3 */}
            <StaggerItem>
              <div className="soft-card p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 mb-5 rounded-2xl bg-[var(--color-sky-tint)] text-[var(--color-ink)] flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase tracking-wide mb-1">
                    Scenario 03 · Dispatch
                  </div>
                  <h3 className="font-display font-bold text-xl text-[var(--color-ink)] mb-3 leading-snug">
                    {t.problem.card3Title}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    {t.problem.card3Text}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--color-border)] font-mono text-xs font-medium text-[var(--color-ink)]">
                  Result: 40+ manual taps per resequence
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 gentle steps) */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-bg-sunken)]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="font-mono text-xs font-semibold text-[var(--color-sage-deep)] uppercase tracking-wider mb-2 block">
              Workflow Architecture
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight mb-4">
              {t.howItWorks.title}
            </h2>
            <p className="font-body text-base text-[var(--color-ink-secondary)] max-w-2xl">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: t.howItWorks.step1Title,
                desc: t.howItWorks.step1Desc,
                badge: 'WhatsApp Paste',
              },
              {
                step: '02',
                title: t.howItWorks.step2Title,
                desc: t.howItWorks.step2Desc,
                badge: 'Hard Deadlines',
              },
              {
                step: '03',
                title: t.howItWorks.step3Title,
                desc: t.howItWorks.step3Desc,
                badge: 'Corridor Optimizer',
              },
              {
                step: '04',
                title: t.howItWorks.step4Title,
                desc: t.howItWorks.step4Desc,
                badge: '56px Driver Mode',
              },
            ].map((st, idx) => (
              <div
                key={idx}
                className="soft-card bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono font-bold text-lg text-[#1F2A27] bg-[var(--color-marigold)] w-9 h-9 flex items-center justify-center rounded-full shadow-sm">
                      {st.step}
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase bg-[var(--color-bg-sunken)] border border-[var(--color-border)] px-2.5 py-0.5 rounded-full">
                      {st.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-ink)] mb-2 leading-snug">
                    {st.title}
                  </h3>
                  <p className="font-body text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[var(--color-border)] flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-ink-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sage-deep)]" />
                  <span>Tactile action verified</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/plan">
              <Button variant="primary" size="touch" icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}>
                Try It With 5 Real Stops
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. GOOGLE MAPS VS ROUTEWALA COMPARISON TABLE */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <span className="font-mono text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mb-2 block">
              Field Benchmarks
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight mb-3">
              {t.comparison.title}
            </h2>
            <p className="font-body text-base text-[var(--color-ink-secondary)] max-w-xl mx-auto">
              {t.comparison.subtitle}
            </p>
          </div>

          {/* Table Container */}
          <div className="border border-[var(--color-border)] rounded-2xl shadow-sm overflow-x-auto bg-[var(--color-surface)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-bg-sunken)] text-[var(--color-ink)] font-body text-xs uppercase border-b border-[var(--color-border)] font-semibold">
                  <th className="p-4 border-r border-[var(--color-border)] min-w-[200px]">
                    {t.comparison.featureCol}
                  </th>
                  <th className="p-4 border-r border-[var(--color-border)] min-w-[220px] text-[var(--color-priority-high)]">
                    {t.comparison.gmapsCol}
                  </th>
                  <th className="p-4 bg-[var(--color-marigold-tint)] text-[var(--color-ink)] font-bold min-w-[240px]">
                    {t.comparison.routewalaCol}
                  </th>
                </tr>
              </thead>
              <tbody className="font-body text-sm divide-y divide-[var(--color-border)]">
                {[
                  {
                    feature: 'Multi-stop sequence optimization',
                    gmaps: 'Manual dragging only, no urgency logic',
                    rw: 'Automatic priority + geographic corridor sort',
                  },
                  {
                    feature: 'Rain & wet finger usability',
                    gmaps: 'Tiny 24px search bars, manual typing needed',
                    rw: 'Massive 56px touch buttons & single-tap Next',
                  },
                  {
                    feature: 'Offline ticket stub manifest',
                    gmaps: 'Stalls when signal drops in Dadar subway',
                    rw: '100% offline manifest stored on device',
                  },
                  {
                    feature: 'On-the-way chai & snack wishlist',
                    gmaps: 'Adds separate route diversion with detour miles',
                    rw: 'Alerts you only if drop is ≤150m from tapri',
                  },
                  {
                    feature: 'Direct 1-tap customer call',
                    gmaps: 'Requires leaving map to open dialer or chat',
                    rw: 'Instant tel: button on every stop card',
                  },
                  {
                    feature: 'Glaring afternoon sunlight readability',
                    gmaps: 'Subtle gray on white, hard to see on bike stand',
                    rw: 'Gentle ink contrast & legible Fraunces headings',
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[var(--color-bg-sunken)]/60 transition-colors"
                  >
                    <td className="p-4 border-r border-[var(--color-border)] font-semibold text-[var(--color-ink)]">
                      {row.feature}
                    </td>
                    <td className="p-4 border-r border-[var(--color-border)] text-[var(--color-ink-secondary)]">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-[var(--color-priority-high)] shrink-0 mt-0.5" />
                        <span>{row.gmaps}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[var(--color-ink)] bg-[var(--color-marigold-tint)]/40">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--color-sage-deep)] stroke-[2.5] shrink-0 mt-0.5" />
                        <span>{row.rw}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. ON-THE-WAY WISHLIST FEATURE */}
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-marigold-tint)] text-[#8c5e03] border border-[var(--color-marigold)]/30 rounded-full font-mono text-xs font-semibold uppercase tracking-wider mb-4">
                <Utensils className="w-4 h-4" />
                <span>Zero Detour Pitstops</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight mb-4 leading-tight">
                {t.wishlistSection.title}
              </h2>
              <p className="font-body text-base text-[var(--color-ink-secondary)] mb-6 leading-relaxed">
                {t.wishlistSection.desc}
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-ink)]">Ashok Vada Pav (Kirti College)</span>
                  <span className="bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] px-2.5 py-0.5 rounded-full font-semibold">+0 km detour</span>
                </div>
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-ink)]">Kyani & Co. (Metro Cinema)</span>
                  <span className="bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] px-2.5 py-0.5 rounded-full font-semibold">+100m on route</span>
                </div>
                <div className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm flex items-center justify-between">
                  <span className="font-semibold text-[var(--color-ink)]">Shabbir Tyre Repair (Lower Parel)</span>
                  <span className="bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] px-2.5 py-0.5 rounded-full font-semibold">Under Pillar 42</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/wishlist">
                  <Button variant="secondary" size="md">
                    Explore Pitstop Catalog
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Soft Schematic Transit Diagram */}
            <div className="lg:col-span-7">
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3 mb-4">
                  <span className="font-mono text-xs font-semibold text-[var(--color-ink)]">
                    ROUTE CORRIDOR: DADAR → LOWER PAREL → MARINE LINES
                  </span>
                  <span className="font-mono text-xs font-semibold text-[var(--color-sage-deep)]">
                    ✓ Optimal alignment
                  </span>
                </div>

                <div className="w-full overflow-hidden bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-xl p-4">
                  <svg
                    viewBox="0 0 600 320"
                    className="w-full h-auto text-[var(--color-ink)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Grid Lines */}
                    <path
                      d="M20 80 H580 M20 160 H580 M20 240 H580"
                      stroke="var(--color-border)"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                    />
                    <path
                      d="M120 20 V300 M240 20 V300 M380 20 V300 M500 20 V300"
                      stroke="var(--color-border)"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                    />

                    {/* Main Delivery Route Highway */}
                    <path
                      d="M 60 70 L 190 70 Q 220 70 230 100 L 250 160 Q 260 190 290 190 L 430 190 Q 460 190 470 220 L 490 260 L 540 260"
                      stroke="var(--color-ink)"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Marigold Transit Center Line */}
                    <path
                      d="M 60 70 L 190 70 Q 220 70 230 100 L 250 160 Q 260 190 290 190 L 430 190 Q 460 190 470 220 L 490 260 L 540 260"
                      stroke="var(--color-marigold)"
                      strokeWidth="2.5"
                      strokeDasharray="7 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Stop 1: Plaza Dadar West */}
                    <g transform="translate(60, 70)">
                      <rect x="-16" y="-16" width="32" height="32" rx="8" fill="var(--color-priority-high-bg)" stroke="var(--color-priority-high)" strokeWidth="2" />
                      <text x="0" y="5" fill="var(--color-priority-high)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        01
                      </text>
                      <text x="0" y="32" fill="var(--color-ink)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600" textAnchor="middle">
                        Plaza Dadar (High)
                      </text>
                    </g>

                    {/* Wishlist Detour Callout: Ashok Vada Pav */}
                    <g transform="translate(195, 60)">
                      <line x1="0" y1="10" x2="35" y2="-25" stroke="var(--color-marigold)" strokeWidth="2" strokeDasharray="3 3" />
                      <rect x="35" y="-48" width="165" height="42" rx="10" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
                      <circle cx="50" cy="-27" r="8" fill="var(--color-marigold-tint)" stroke="var(--color-marigold)" strokeWidth="1.5" />
                      <text x="50" y="-23" fill="#8c5e03" fontSize="10" fontWeight="bold" textAnchor="middle">★</text>
                      <text x="66" y="-32" fill="var(--color-ink)" fontSize="11" fontFamily="var(--font-body)" fontWeight="bold">
                        Ashok Vada Pav
                      </text>
                      <text x="66" y="-17" fill="var(--color-sage-deep)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
                        0 KM DETOUR (Kirti Col.)
                      </text>
                    </g>

                    {/* Stop 2: Matoshree Niwas */}
                    <g transform="translate(250, 160)">
                      <rect x="-16" y="-16" width="32" height="32" rx="8" fill="var(--color-marigold-tint)" stroke="var(--color-marigold)" strokeWidth="2" />
                      <text x="0" y="5" fill="#8c5e03" fontSize="12" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        02
                      </text>
                      <text x="40" y="5" fill="var(--color-ink)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600">
                        Bhavani Shankar Rd
                      </text>
                    </g>

                    {/* Wishlist Callout 2: Shabbir Tyre Repair */}
                    <g transform="translate(360, 190)">
                      <line x1="0" y1="0" x2="0" y2="40" stroke="var(--color-sage)" strokeWidth="2" strokeDasharray="3 3" />
                      <rect x="-70" y="40" width="150" height="36" rx="8" fill="var(--color-surface)" stroke="var(--color-border)" strokeWidth="1.5" />
                      <text x="-60" y="55" fill="var(--color-ink)" fontSize="10" fontFamily="var(--font-body)" fontWeight="600">
                        Shabbir Tyre (Pillar 42)
                      </text>
                      <text x="-60" y="68" fill="var(--color-sage-deep)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="600">
                        Puncture & Air Refill
                      </text>
                    </g>

                    {/* Stop 3: Lower Parel Tech Center */}
                    <g transform="translate(430, 190)">
                      <rect x="-16" y="-16" width="32" height="32" rx="8" fill="var(--color-priority-high-bg)" stroke="var(--color-priority-high)" strokeWidth="2" />
                      <text x="0" y="5" fill="var(--color-priority-high)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        03
                      </text>
                      <text x="0" y="-24" fill="var(--color-ink)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600" textAnchor="middle">
                        One World Center
                      </text>
                    </g>

                    {/* Stop 4: Colaba Final */}
                    <g transform="translate(540, 260)">
                      <rect x="-16" y="-16" width="32" height="32" rx="8" fill="var(--color-sage-tint)" stroke="var(--color-sage)" strokeWidth="2" />
                      <text x="0" y="5" fill="var(--color-sage-deep)" fontSize="12" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">
                        04
                      </text>
                      <text x="0" y="32" fill="var(--color-ink)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600" textAnchor="middle">
                        Colaba Market
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="mt-3.5 flex items-center justify-between text-xs font-mono text-[var(--color-ink-muted)]">
                  <span>★ Marked pitstops appear along normal transit corridor</span>
                  <span className="font-semibold text-[var(--color-ink)]">NO UNWANTED U-TURNS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ACCESSIBILITY & PRIVACY COMMITMENTS */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-2xl bg-[var(--color-sage-tint)] text-[var(--color-sage-deep)] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--color-ink)] tracking-tight mb-2">
              {t.privacy.title}
            </h2>
            <p className="font-body text-sm sm:text-base text-[var(--color-ink-secondary)] max-w-lg mx-auto">
              {t.privacy.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-sunken)] shadow-sm">
              <div className="font-mono text-xs font-semibold text-[var(--color-sage-deep)] mb-1">
                COMMITMENT 01
              </div>
              <h3 className="font-display font-bold text-base text-[var(--color-ink)] mb-2">
                Location Strictly Opt-In
              </h3>
              <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {t.privacy.optInLoc}
              </p>
            </div>

            <div className="p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-sunken)] shadow-sm">
              <div className="font-mono text-xs font-semibold text-[var(--color-sage-deep)] mb-1">
                COMMITMENT 02
              </div>
              <h3 className="font-display font-bold text-base text-[var(--color-ink)] mb-2">
                100% Local Storage First
              </h3>
              <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {t.privacy.localOnly}
              </p>
            </div>

            <div className="p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-sunken)] shadow-sm">
              <div className="font-mono text-xs font-semibold text-[var(--color-sage-deep)] mb-1">
                COMMITMENT 03
              </div>
              <h3 className="font-display font-bold text-base text-[var(--color-ink)] mb-2">
                Underground & Subway Ready
              </h3>
              <p className="font-body text-xs text-[var(--color-ink-secondary)] leading-relaxed">
                {t.privacy.offlineReady}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAGE FINAL CTA BAND WITH MUMBAI SKYLINE */}
      <section className="relative bg-gradient-to-b from-[var(--color-sage-tint)] to-[var(--color-bg)] py-16 px-4 md:px-8 border-b border-[var(--color-border)] overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--color-ink)] mb-4">
            Ready to plan your Mumbai dispatch?
          </h2>
          <p className="font-body text-base text-[var(--color-ink-secondary)] mb-8 max-w-xl mx-auto">
            Add your parcel addresses, sort by urgency, and enjoy seamless one-touch driver mode across the city.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link to="/plan">
              <Button variant="primary" size="touch" icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}>
                Start Planning Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="touch">
                Sign In with Supabase
              </Button>
            </Link>
          </div>
        </div>

        {/* Hand-drawn Mumbai Skyline Illustration */}
        <div className="mt-12 -mb-4 max-w-5xl mx-auto opacity-75">
          <MumbaiSkyline className="w-full h-auto" />
        </div>
      </section>

      {/* 7. WARM FOOTER */}
      <footer className="bg-[#1F2A27] text-white dark:bg-[#101514] dark:border-t dark:border-[#2B3833] py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-white/15">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-[var(--color-marigold)] text-[#1F2A27] font-display font-bold text-base flex items-center justify-center shadow-sm">
                  RW
                </span>
                <span className="font-display font-bold text-2xl tracking-tight text-white">
                  RouteWala
                </span>
              </div>
              <p className="font-body text-sm text-white/70 max-w-sm mb-4 leading-relaxed">
                A multi-stop route planner engineered for Mumbai delivery workers, courier riders, and dhabawalas navigating the western and central corridors.
              </p>
              <div className="font-mono text-xs text-[var(--color-marigold)]">
                TRANSIT DIVISION · MUMBAI METROPOLITAN PROJECT
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="font-mono text-xs font-semibold text-[var(--color-marigold)] uppercase tracking-wider mb-3">
                Application Routes
              </div>
              <ul className="space-y-2 font-body text-sm text-white/80">
                <li>
                  <Link to="/plan" className="hover:text-[var(--color-marigold)] transition-colors">
                    Plan Stops (/plan)
                  </Link>
                </li>
                <li>
                  <Link to="/route" className="hover:text-[var(--color-marigold)] transition-colors">
                    Route Sequence Board (/route)
                  </Link>
                </li>
                <li>
                  <Link to="/go" className="hover:text-[var(--color-marigold)] transition-colors">
                    56px Driver Mode (/go)
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="hover:text-[var(--color-marigold)] transition-colors">
                    On-the-Way Pitstops (/wishlist)
                  </Link>
                </li>
                <li>
                  <Link to="/summary" className="hover:text-[var(--color-marigold)] transition-colors">
                    Shift Report (/summary)
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <div className="font-mono text-xs font-semibold text-[var(--color-marigold)] uppercase tracking-wider mb-3">
                Design & Accessibility
              </div>
              <ul className="space-y-2 font-body text-sm text-white/80">
                <li>
                  <Link to="/design" className="hover:text-[var(--color-marigold)] transition-colors">
                    Design System & Tokens (/design)
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-[var(--color-marigold)] transition-colors">
                    Preferences & Language (/settings)
                  </Link>
                </li>
                <li className="pt-2 text-xs font-body text-white/60">
                  Palette: Cream #FAF6EF, Ink #1F2A27, Marigold #F2B84B, Sage #A9C4B0.
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-white/60">
            <div>RouteWala Mumbai · Soft Mumbai Morning Architecture</div>
            <div>Built for courier riders with gloves and wet screens</div>
          </div>
        </div>
      </footer>
    </div>
  );
};