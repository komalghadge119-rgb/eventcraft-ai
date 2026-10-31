/**
 * @fileoverview Edge case tests for AuraPlan AI.
 * Tests zero budget, mega budget, minimum guest counts, and missing event dates.
 */

import { describe, it, expect } from 'vitest';
import { computeBudgetAllocation } from '../services/fallbackSynthesizer';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import type { EventInput } from '../types/event';

const baseInput: EventInput = {
  eventType: 'Wedding',
  eventDate: '2027-06-15',
  totalBudget: 1000000,
  currency: 'INR',
  guestCount: 100,
  durationHours: 8,
  locationType: 'Banquet Hall',
  specialRequirements: '',
};

describe('Edge Cases — Zero Budget', () => {
  it('should handle zero budget without throwing', () => {
    expect(() => computeBudgetAllocation(0, 'INR')).not.toThrow();
  });

  it('should produce zero contingency for zero budget', () => {
    const { contingencyReserve } = computeBudgetAllocation(0, 'INR');
    expect(contingencyReserve).toBe(0);
  });
});

describe('Edge Cases — Mega Budget (₹100 Crore)', () => {
  it('should handle very large budgets without overflow', () => {
    const total = 1_000_000_000; /* ₹100 Crore */
    const { categories, contingencyReserve } = computeBudgetAllocation(total, 'INR');
    const pillarSum = categories.reduce((acc, c) => acc + c.allocated, 0);
    expect(Math.abs(pillarSum + contingencyReserve - total)).toBeLessThanOrEqual(5);
  });
});

describe('Edge Cases — Minimum Guest Count', () => {
  it('should synthesize a plan for a single guest event', () => {
    const input = { ...baseInput, guestCount: 1 };
    const plan = synthesizeFallbackPlan(input);
    expect(plan.guestCount).toBe(1);
    expect(plan.budgetAllocation.categories).toHaveLength(5);
  });
});

describe('Edge Cases — Missing Event Date', () => {
  it('should synthesize a plan without an event date', () => {
    const input = { ...baseInput, eventDate: '' };
    const plan = synthesizeFallbackPlan(input);
    expect(plan).toBeDefined();
    expect(plan.eventSummary.title).toBeTruthy();
  });
});

describe('Edge Cases — Hackathon vs Wedding Event Type', () => {
  it('should produce a hackathon-specific timeline for hackathon events', () => {
    const input = { ...baseInput, eventType: 'Tech Hackathon' };
    const plan = synthesizeFallbackPlan(input);
    const activities = plan.timelineItinerary.map((t) => t.activity.toLowerCase()).join(' ');
    expect(activities).toMatch(/hack|build|demo|submission|keynote/i);
  });

  it('should produce a wedding-specific timeline for wedding events', () => {
    const input = { ...baseInput, eventType: 'Royal Heritage Wedding' };
    const plan = synthesizeFallbackPlan(input);
    const activities = plan.timelineItinerary.map((t) => t.activity.toLowerCase()).join(' ');
    expect(activities).toMatch(/ceremony|vow|processional|dance|reception/i);
  });
});
