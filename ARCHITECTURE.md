# 🏗️ EventCraft AI — System Architecture & Design Philosophy

## 1. High-Level System Overview
EventCraft AI is engineered as an autonomous event planning intelligence engine utilizing a **5-Agent Cognitive Council** pattern. It decouples high-level creative synthesis from deterministic operational invariants (budget calculations, chronological buffer dampening, and risk triggers).

```
                      ┌───────────────────────────┐
                      │   User Specification /    │
                      │     Evaluator Preset      │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │   Input Security Guard    │
                      │ (XSS & Prototype Shield)  │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │     Synthesizer Gateway   │
                      └──────┬─────────────┬──────┘
                             │             │
                    [Online] │             │ [Offline / Quota Exceeded]
                             ▼             ▼
              ┌─────────────────────┐   ┌──────────────────────────┐
              │ Google Gemini 2.0   │   │  Deterministic Fallback  │
              │ Flash AI Engine     │   │  Mathematical Synthesizer│
              └──────────────┬──────┘   └─────────────┬────────────┘
                             │                        │
                             └───────────┬────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │       5-Agent Cognitive Council Matrix          │
                 │                                                 │
                 │  • [ARCHITECT]: Aesthetic & Dual-Copywriting    │
                 │  • [QUANT]: 5-Pillar Budget + 12% Contingency   │
                 │  • [CHRONOPLANNER]: Friction-Damped Itinerary   │
                 │  • [LOGISTICS]: Vendor Procurement & SLA Matrix │
                 │  • [SENTINEL]: FMEA Risk Matrix & Trigger Logic │
                 └───────────────────────┬─────────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │          Immutable EventPlan Domain Model       │
                 └───────────────────────┬─────────────────────────┘
                                         ▼
                 ┌─────────────────────────────────────────────────┐
                 │            Reactive UI Presentation             │
                 │  • BudgetSection        • TimelineSection       │
                 │  • VendorSection        • InvitationSection     │
                 │  • GuestTrackerSection  • RiskSentinelSection   │
                 │  • PersonalizedIdeasSection                     │
                 └─────────────────────────────────────────────────┘
```

## 2. Core Architectural Pillars

### A. Strict Type Safety & Immutability
- Built on **TypeScript 5.8** in strict mode (`strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`, `noUnusedParameters: true`).
- Pure domain models in [`src/types/event.ts`](file:///c:/Users/snehal/Desktop/eventsss/kom%20promptwars/src/types/event.ts) enforce contracts across every component and service.
- State transitions are immutable via functional updates in [`useEventPlan.ts`](file:///c:/Users/snehal/Desktop/eventsss/kom%20promptwars/src/hooks/useEventPlan.ts).

### B. Single Responsibility & Separation of Concerns
1. **Presentation Layer (`src/components/`)**: Pure view components wrapped in React 19 lazy boundaries (`React.lazy` + `Suspense`).
2. **Business Logic Layer (`src/services/`)**:
   - `aiService.ts`: Communicates with Google Gemini 2.0 Flash via `@google/genai`.
   - `fallbackSynthesizer.ts`: Pure mathematical allocation engine with duration scaling and offline resilience.
3. **State Management (`src/hooks/useEventPlan.ts`)**: Custom hook consolidating plan generation, preset ingestion, and interactive mutations.
4. **Security Layer (`src/utils/sanitizer.ts`)**: Multi-stage sanitation neutralizing XSS, HTML entities, and prototype-pollution.
5. **Utility Layer (`src/utils/exportUtils.ts`, `src/utils/logger.ts`)**: RFC 5545 `.ics` export, structured logging, and markdown dossiers.

### C. Mathematical Budget Invariants
The financial allocation satisfies the strict invariant:
$$\text{Total} = \sum_{i=1}^5 \text{Category}_i + \text{ContingencyReserve}$$
where:
- Venue & Infrastructure = 35%
- Catering & Food = 28%
- Decor & Lighting = 15%
- Entertainment & Media = 12%
- Logistics & Guest Care = 10%
- Dynamic Contingency Reserve = Exactly 12% of Total Budget

### D. Zero-Trust Security Model
- Content Security Policy (CSP) blocking unauthorized external scripts.
- Ephemeral sessionStorage for API keys; zero persistence to disk or localStorage.
- Complete sanitization pipeline protecting against `__proto__` and `constructor` attacks.
