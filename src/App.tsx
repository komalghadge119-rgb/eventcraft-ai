/**
 * @fileoverview Main application component for AuraPlan AI.
 * Orchestrates the luxury event planning experience with lazy-loaded sections,
 * React Suspense skeletons, and a full landing hero for empty state.
 */

import React, { useState, Suspense, lazy } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { PlanModal } from './components/PlanModal';
import { EventHeader } from './components/EventHeader';
import { useEventPlan } from './hooks/useEventPlan';
import { PRESET_DISPLAY } from './constants';

/** Lazy-loaded plan section components for code-splitting and sub-second initial paint */
const BudgetSection = lazy(() => import('./components/BudgetSection').then((m) => ({ default: m.BudgetSection })));
const TimelineSection = lazy(() => import('./components/TimelineSection').then((m) => ({ default: m.TimelineSection })));
const VendorSection = lazy(() => import('./components/VendorSection').then((m) => ({ default: m.VendorSection })));
const InvitationSection = lazy(() => import('./components/InvitationSection').then((m) => ({ default: m.InvitationSection })));
const PersonalizedIdeasSection = lazy(() => import('./components/PersonalizedIdeasSection').then((m) => ({ default: m.PersonalizedIdeasSection })));
const GuestTrackerSection = lazy(() => import('./components/GuestTrackerSection').then((m) => ({ default: m.GuestTrackerSection })));
const RiskSentinelSection = lazy(() => import('./components/RiskSentinelSection').then((m) => ({ default: m.RiskSentinelSection })));

/**
 * Suspense fallback skeleton card for lazy-loaded sections.
 * @returns {React.ReactElement} A pulsing skeleton placeholder element.
 */
const SectionSkeleton: React.FC = () => (
  <div className="section-skeleton" aria-busy="true" aria-label="Loading section...">
    <div className="skeleton-header" />
    <div className="skeleton-body">
      <div className="skeleton-line skeleton-line-wide" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-medium" />
    </div>
  </div>
);

/**
 * Root application component.
 * Manages plan state, modal visibility, and renders the full platform layout.
 * @returns {React.ReactElement} The rendered application root.
 */
const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    plan,
    loading,
    error,
    generatePlan,
    loadPreset,
    toggleTimelineItem,
    toggleVendorTask,
    toggleIdeaFavorite,
    cycleGuestRsvp,
    addGuest,
  } = useEventPlan();

  return (
    <ErrorBoundary>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <div className="app-shell">
        <Navbar
          onLoadPreset={loadPreset}
          onOpenSynthesizer={() => setShowModal(true)}
          plan={plan}
        />

        <main id="main-content" className="app-main" aria-label="EventCraft AI Event Blueprint Dashboard">

          {/* Loading State */}
          {loading && (
            <div className="loading-overlay" role="status" aria-live="polite" aria-label="Generating event blueprint">
              <div className="loading-card">
                <Loader2 className="spinner-xl" size={48} aria-hidden="true" />
                <h2 className="loading-title">5-Agent Council Synthesizing...</h2>
                <p className="loading-subtitle">
                  [ARCHITECT] → [QUANT] → [CHRONOPLANNER] → [LOGISTICS] → [SENTINEL]
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-banner" role="alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Empty State — Landing Hero */}
          {!plan && !loading && (
            <div className="landing-hero">
              <div className="landing-hero-content">
                <div className="landing-badge">
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Powered by Google Gemini 2.0 Flash · 5-Agent Architecture</span>
                </div>
                <h1 className="landing-title">
                  Architect Extraordinary Events with AI Precision
                </h1>
                <p className="landing-subtitle">
                  EventCraft AI synthesizes complete wedding, birthday, and community event blueprints
                  through an autonomous 5-Agent Cognitive Council — delivering mathematically precise
                  budgets, friction-damped schedules, vendor contracts, and FMEA risk matrices in seconds.
                </p>

                <div className="landing-actions">
                  <button
                    className="landing-cta-primary"
                    onClick={() => setShowModal(true)}
                    type="button"
                    aria-label="Open the blueprint synthesis dialog to create a new event plan"
                    id="landing-synthesize-btn"
                  >
                    <Sparkles size={18} aria-hidden="true" />
                    Synthesize Your Blueprint
                  </button>
                </div>

                <div className="landing-presets">
                  <p className="landing-presets-label">Or load an evaluator preset:</p>
                  <div className="landing-preset-grid">
                    {PRESET_DISPLAY.map((preset) => (
                      <button
                        key={preset.key}
                        className="landing-preset-card"
                        onClick={() => loadPreset(preset.key)}
                        type="button"
                        aria-label={`Load preset: ${preset.title}`}
                        id={`preset-${preset.key}`}
                      >
                        <span className="preset-card-emoji">{preset.emoji}</span>
                        <div className="preset-card-info">
                          <span className="preset-card-title">{preset.title}</span>
                          <span className="preset-card-subtitle">{preset.subtitle}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="landing-features">
                  {[
                    { emoji: '💰', title: '5-Pillar Budget Engine', desc: 'Mathematically precise with 12% contingency reserve' },
                    { emoji: '⏱️', title: 'ChronoPlanner Timeline', desc: 'RFC 5545 export with friction-damped buffers' },
                    { emoji: '📋', title: 'Vendor SLA Matrix', desc: 'Contractual clauses & procurement deadlines' },
                    { emoji: '🛡️', title: 'Sentinel FMEA Grid', desc: 'Automated Plan B trigger conditions' },
                    { emoji: '👥', title: 'RSVP Operations Matrix', desc: 'Dietary triage & real-time headcount' },
                    { emoji: '💌', title: 'Invitation Studio', desc: 'Formal cards & WhatsApp broadcasts' },
                  ].map((feature) => (
                    <div key={feature.title} className="feature-card">
                      <span className="feature-emoji">{feature.emoji}</span>
                      <div className="feature-info">
                        <span className="feature-title">{feature.title}</span>
                        <span className="feature-desc">{feature.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Plan Dashboard */}
          {plan && !loading && (
            <div className="plan-dashboard">
              <EventHeader plan={plan} />

              <div className="plan-sections">
                <Suspense fallback={<SectionSkeleton />}>
                  <BudgetSection budget={plan.budgetAllocation} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <TimelineSection timeline={plan.timelineItinerary} onToggle={toggleTimelineItem} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <VendorSection vendors={plan.vendorChecklist} onToggle={toggleVendorTask} />
                </Suspense>

                <Suspense fallback={<SectionSkeleton />}>
                  <InvitationSection invitation={plan.invitationStudio} />
                </Suspense>

                {plan.personalizedIdeas && plan.personalizedIdeas.length > 0 && (
                  <Suspense fallback={<SectionSkeleton />}>
                    <PersonalizedIdeasSection
                      ideas={plan.personalizedIdeas}
                      onToggleFavorite={toggleIdeaFavorite}
                    />
                  </Suspense>
                )}

                {plan.guestList && plan.guestList.length > 0 && (
                  <Suspense fallback={<SectionSkeleton />}>
                    <GuestTrackerSection
                      guests={plan.guestList}
                      onCycleRsvp={cycleGuestRsvp}
                      onAddGuest={addGuest}
                    />
                  </Suspense>
                )}

                <Suspense fallback={<SectionSkeleton />}>
                  <RiskSentinelSection risks={plan.riskContingencyMatrix} />
                </Suspense>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer" role="contentinfo">
          <div className="footer-inner">
            <span className="footer-brand">
              <Sparkles size={14} aria-hidden="true" />
              EventCraft AI — 5-Agent Cognitive Event Architecture Platform
            </span>
            <span className="footer-credit">
              Powered by{' '}
              <a
                href="https://ai.google.dev"
                target="_blank"
                rel="noopener noreferrer"
                referrerPolicy="no-referrer"
                aria-label="Google Gemini API (opens in new tab)"
              >
                Google Gemini 2.0 Flash
              </a>
            </span>
          </div>
        </footer>

        <PlanModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={generatePlan}
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
