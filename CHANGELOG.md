# 📜 Changelog

All notable changes to **EventCraft AI** are documented in this file.
The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] — 2026-11-01

### 🚀 Major Enhancements
- **React 19 Memoization Optimization**: Wrapped all event handlers across components in `useCallback` to prevent re-render cascades.
- **Reconciliation Integrity**: Replaced all array index keys with unique deterministic keys across `BudgetSection`, `TimelineSection`, and `RiskSentinelSection`.
- **Duration-Scaled ChronoPlanner**: Implemented `scaleTimelineByDuration` to dynamically calculate schedule density based on event length.
- **Cryptographic Security**: Upgraded all unique ID generators from timestamp strings to `crypto.randomUUID()`.
- **Form Constraints**: Added strict input validation and WCAG `aria-required` attributes to `PlanModal`.
- **Clean Architecture Documentation**: Added `ARCHITECTURE.md`, `.eslintrc.json`, `.prettierrc`, `.editorconfig`, and `sonar-project.properties`.

## [2.0.0] — 2026-10-31

### 🌟 Initial Release
- **5-Agent Cognitive Council**: Autonomous orchestration of ARCHITECT, QUANT, CHRONOPLANNER, LOGISTICS, and SENTINEL.
- **Personalized Ideas Matrix**: Challenge 5 tailored creative concepts across Decor, Culinary, Entertainment, and Experiential moments.
- **Offline Fallback Engine**: Mathematical synthesizer guaranteeing zero-latency event generation without API dependencies.
- **RFC 5545 iCalendar Sync**: 1-click `.ics` calendar sync and Markdown executive dossier export.
- **WCAG 2.1 AAA Accessibility**: High contrast, skip-link, keyboard operability, and ARIA live regions.
- **Zero-Trust Security**: Multi-stage HTML sanitization and recursive prototype-pollution defense.

