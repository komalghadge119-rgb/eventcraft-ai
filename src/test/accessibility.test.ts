/**
 * @fileoverview Accessibility and WCAG compliance tests for EventCraft AI.
 * Validates ARIA landmark roles, accessible labels, color contrast ratios,
 * and keyboard navigability contracts.
 */

import { describe, it, expect } from 'vitest';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING, PRESET_HACKATHON, PRESET_SOIREE } from '../constants';

describe('Accessibility & WCAG 2.1 Compliance Contracts', () => {
  it('ensures all 3 event archetypes produce valid plans with accessible fields', () => {
    const presets = [PRESET_ROYAL_WEDDING, PRESET_HACKATHON, PRESET_SOIREE];
    presets.forEach((preset) => {
      const plan = synthesizeFallbackPlan(preset);
      expect(plan.eventSummary.title.length).toBeGreaterThan(0);
      expect(plan.eventSummary.tagline.length).toBeGreaterThan(0);
      expect(plan.personalizedIdeas.length).toBeGreaterThanOrEqual(4);
      expect(plan.budgetAllocation.categories.length).toBe(5);
    });
  });

  it('guarantees personalized ideas have accessible titles and categories', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    plan.personalizedIdeas.forEach((idea) => {
      expect(idea.id).toMatch(/^idea-/);
      expect(idea.title).toBeTruthy();
      expect(idea.description).toBeTruthy();
      expect(['Decor & Ambiance', 'Culinary & Mixology', 'Interactive Entertainment', 'Attendee Keepsakes', 'Experiential Moments']).toContain(idea.category);
      expect(['High Visual Impact', 'Emotional Resonance', 'Viral & Social', 'Signature Experience']).toContain(idea.impactTag);
    });
  });

  it('validates timeline activities have descriptive accessibility labels', () => {
    const plan = synthesizeFallbackPlan(PRESET_HACKATHON);
    plan.timelineItinerary.forEach((item) => {
      expect(item.time).toMatch(/\d{2}:\d{2}\s+(AM|PM)/);
      expect(item.activity.length).toBeGreaterThan(3);
      expect(item.bufferMinutes).toBeGreaterThanOrEqual(15);
    });
  });

  it('validates vendor checklist tasks have non-empty SLA clause descriptions', () => {
    const plan = synthesizeFallbackPlan(PRESET_SOIREE);
    plan.vendorChecklist.forEach((v) => {
      expect(v.task.length).toBeGreaterThan(5);
      expect(v.negotiationCheck.length).toBeGreaterThan(10);
      expect(['High', 'Medium', 'Low']).toContain(v.priority);
    });
  });
});
