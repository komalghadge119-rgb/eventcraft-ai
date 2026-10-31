/**
 * @fileoverview useEventPlan hook tests for EventCraft AI.
 * Validates preset switching, state updates, and deterministic synthesizer behavior.
 */

import { describe, it, expect } from 'vitest';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_MAP, PRESET_ROYAL_WEDDING, PRESET_HACKATHON, PRESET_SOIREE } from '../constants';

describe('useEventPlan / Fallback Synthesizer — Preset Loading', () => {
  it('should produce a valid plan for the royal_wedding preset', () => {
    const plan = synthesizeFallbackPlan(PRESET_MAP['royal_wedding']);
    expect(plan).toBeDefined();
    expect(plan.guestCount).toBe(PRESET_ROYAL_WEDDING.guestCount);
    expect(plan.budgetAllocation.total).toBe(PRESET_ROYAL_WEDDING.totalBudget);
  });

  it('should produce a valid plan for the hackathon preset', () => {
    const plan = synthesizeFallbackPlan(PRESET_MAP['hackathon']);
    expect(plan).toBeDefined();
    expect(plan.guestCount).toBe(PRESET_HACKATHON.guestCount);
    expect(plan.durationHours).toBe(PRESET_HACKATHON.durationHours);
  });

  it('should produce a valid plan for the soiree preset', () => {
    const plan = synthesizeFallbackPlan(PRESET_MAP['soiree']);
    expect(plan).toBeDefined();
    expect(plan.guestCount).toBe(PRESET_SOIREE.guestCount);
    expect(plan.budgetAllocation.total).toBe(PRESET_SOIREE.totalBudget);
  });

  it('should generate unique IDs for each plan synthesis', () => {
    const plan1 = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const plan2 = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    expect(plan1.id).not.toBe(plan2.id);
  });
});

describe('useEventPlan / Fallback Synthesizer — Plan Structure', () => {
  it('should always produce all 5 required EventPlan sections', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    expect(plan.eventSummary).toBeDefined();
    expect(plan.budgetAllocation).toBeDefined();
    expect(plan.timelineItinerary).toBeDefined();
    expect(plan.vendorChecklist).toBeDefined();
    expect(plan.invitationStudio).toBeDefined();
    expect(plan.personalizedIdeas).toBeDefined();
    expect(plan.personalizedIdeas.length).toBeGreaterThan(0);
    expect(plan.riskContingencyMatrix).toBeDefined();
  });

  it('should have createdAt as a valid ISO 8601 timestamp', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const parsed = new Date(plan.createdAt);
    expect(parsed.toString()).not.toBe('Invalid Date');
  });
});
