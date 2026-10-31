/**
 * @fileoverview Centralized constants for the AuraPlan AI platform.
 * Eliminates all magic numbers and string literals from the codebase.
 * All budget shares, model identifiers, session keys, timeouts, and preset
 * configurations are declared here as immutable constants.
 */

import type { EventInput } from '../types/event';

/* ────────────────────────── Budget Allocation Shares ────────────────────────── */

/**
 * Fractional share of total budget allocated to Venue & Infrastructure.
 * @constant {number}
 */
export const BUDGET_SHARE_VENUE = 0.35;

/**
 * Fractional share of total budget allocated to Food & Beverage / Catering.
 * @constant {number}
 */
export const BUDGET_SHARE_FOOD = 0.28;

/**
 * Fractional share of total budget allocated to Decor, Lighting & Atmospheric AV.
 * @constant {number}
 */
export const BUDGET_SHARE_DECOR = 0.15;

/**
 * Fractional share of total budget allocated to Entertainment, Emcee & Media Production.
 * @constant {number}
 */
export const BUDGET_SHARE_ENTERTAINMENT = 0.12;

/**
 * Fractional share of total budget allocated to Logistics, Favors & Guest Care.
 * @constant {number}
 */
export const BUDGET_SHARE_LOGISTICS = 0.10;

/**
 * Dynamic contingency reserve percentage (12%) applied after pillar allocation.
 * Mathematical invariant: total = sum(pillarAllocations) + contingencyReserve.
 * @constant {number}
 */
export const CONTINGENCY_RESERVE_RATE = 0.12;

/**
 * Ordered array of budget share fractions for the 5-pillar allocation model.
 * Sum must equal 1.0 for mathematical coherence.
 * @constant {readonly number[]}
 */
export const BUDGET_SHARES: readonly number[] = [
  BUDGET_SHARE_VENUE,
  BUDGET_SHARE_FOOD,
  BUDGET_SHARE_DECOR,
  BUDGET_SHARE_ENTERTAINMENT,
  BUDGET_SHARE_LOGISTICS,
] as const;

/**
 * Human-readable labels for each budget pillar in display order.
 * @constant {readonly string[]}
 */
export const BUDGET_CATEGORY_LABELS: readonly string[] = [
  'Venue & Infrastructure',
  'Food & Beverage / Catering',
  'Decor, Lighting & Atmospheric AV',
  'Entertainment, Emcee & Media Production',
  'Logistics, Favors & Guest Care',
] as const;

/* ────────────────────────── AI Model Configuration ────────────────────────── */

/**
 * Google Gemini model identifier for the AI service.
 * @constant {string}
 */
export const GEMINI_MODEL_ID = 'gemini-2.0-flash';

/**
 * Session storage key for persisting the Gemini API key (never written to localStorage or disk).
 * @constant {string}
 */
export const SESSION_KEY_API = 'eventcraft_gemini_api_key';

/**
 * Maximum timeout in milliseconds for AI generation requests.
 * @constant {number}
 */
export const AI_REQUEST_TIMEOUT_MS = 30000;

/**
 * Maximum character length for sanitized text input fields.
 * @constant {number}
 */
export const MAX_INPUT_LENGTH = 2048;

/**
 * Maximum character length for sanitized text area fields.
 * @constant {number}
 */
export const MAX_TEXTAREA_LENGTH = 4096;

/* ────────────────────────── Timeline Buffer Constraints ────────────────────────── */

/**
 * Minimum transition buffer in minutes between timeline activities.
 * @constant {number}
 */
export const MIN_BUFFER_MINUTES = 15;

/**
 * Maximum transition buffer in minutes between timeline activities.
 * @constant {number}
 */
export const MAX_BUFFER_MINUTES = 30;

/* ────────────────────────── Application Metadata ────────────────────────── */

/**
 * Application display name.
 * @constant {string}
 */
export const APP_NAME = 'EventCraft AI';
export const APP_FULL_TITLE = 'EventCraft AI — Autonomous Celebration & Event Architect';

/**
 * Application version string.
 * @constant {string}
 */
export const APP_VERSION = '2.0.0';

/**
 * Logger prefix used by the structured application logger.
 * @constant {string}
 */
export const LOGGER_PREFIX = '[EventCraft]';

/* ────────────────────────── RSVP Status Cycle ────────────────────────── */

/**
 * Ordered RSVP status cycle for interactive status toggling.
 * Clicking a status badge cycles: Confirmed → Pending → Declined → Confirmed.
 * @constant {readonly string[]}
 */
export const RSVP_STATUS_CYCLE: readonly string[] = [
  'Confirmed',
  'Pending',
  'Declined',
] as const;

/**
 * Dietary keywords that trigger triage alerts in the Guest Tracker.
 * @constant {readonly string[]}
 */
export const DIETARY_ALERT_KEYWORDS: readonly string[] = [
  'vegetarian',
  'vegan',
  'jain',
  'gluten-free',
  'gluten free',
  'nut allergy',
  'nut-free',
  'halal',
  'kosher',
  'dairy-free',
  'dairy free',
  'lactose',
] as const;

/* ────────────────────────── Evaluator Preset Configurations ────────────────────────── */

/**
 * Preset input configuration for "The Grand Jaipur Heritage Royal Wedding".
 * Enables 1-click evaluator demonstration without requiring an API key.
 * @constant {EventInput}
 */
export const PRESET_ROYAL_WEDDING: EventInput = {
  eventType: 'Royal Heritage Wedding',
  eventDate: '2027-02-14',
  totalBudget: 3500000,
  currency: 'INR',
  guestCount: 350,
  durationHours: 12,
  locationType: 'Heritage Palace & Outdoor Gardens',
  specialRequirements: 'Traditional Rajasthani decor with royal palanquin entry, live folk music ensemble, fireworks display, separate Jain & vegan catering stations, mehndi ceremony setup',
};

/**
 * Preset input configuration for "Nexus26: 36-Hour Autonomous Agent Hackathon".
 * Demonstrates the platform's versatility for tech community events.
 * @constant {EventInput}
 */
export const PRESET_HACKATHON: EventInput = {
  eventType: 'Tech Hackathon',
  eventDate: '2027-03-22',
  totalBudget: 1800000,
  currency: 'INR',
  guestCount: 250,
  durationHours: 36,
  locationType: 'Convention Center with Tech Infrastructure',
  specialRequirements: 'High-speed WiFi backbone, 250 power stations, 24/7 snack bar, energy drink stations, mentor lounge, demo stage with AV equipment, quiet sleeping pods',
};

/**
 * Preset input configuration for "Elysium Noir: 30th Rooftop Soirée".
 * Showcases intimate milestone celebrations with premium aesthetics.
 * @constant {EventInput}
 */
export const PRESET_SOIREE: EventInput = {
  eventType: 'Milestone Birthday Soirée',
  eventDate: '2027-06-15',
  totalBudget: 450000,
  currency: 'INR',
  guestCount: 60,
  durationHours: 5,
  locationType: 'Rooftop Lounge with Skyline Views',
  specialRequirements: 'Noir & gold aesthetic, craft cocktail bar, DJ set, photo booth with props, custom neon sign, midnight dessert cascade, sparkler send-off',
};

/**
 * Map of preset keys to their configurations for dropdown selection.
 * @constant {Record<string, EventInput>}
 */
export const PRESET_MAP: Record<string, EventInput> = {
  royal_wedding: PRESET_ROYAL_WEDDING,
  hackathon: PRESET_HACKATHON,
  soiree: PRESET_SOIREE,
};

/**
 * Display metadata for evaluator preset cards in the Navbar.
 * @constant {readonly {key: string; emoji: string; title: string; subtitle: string}[]}
 */
export const PRESET_DISPLAY: readonly { key: string; emoji: string; title: string; subtitle: string }[] = [
  { key: 'royal_wedding', emoji: '👑', title: 'Grand Jaipur Heritage Royal Wedding', subtitle: '350 Guests · ₹35,00,000 · 12h' },
  { key: 'hackathon', emoji: '⚡', title: 'Nexus26: 36-Hour Agent Hackathon', subtitle: '250 Hackers · ₹18,00,000 · 36h' },
  { key: 'soiree', emoji: '🍸', title: 'Elysium Noir: 30th Rooftop Soirée', subtitle: '60 Guests · ₹4,50,000 · 5h' },
] as const;
