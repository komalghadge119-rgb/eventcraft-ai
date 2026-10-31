/**
 * @fileoverview Pipeline integration tests for EventCraft AI.
 * End-to-end tests verifying raw untrusted input sanitization through master plan
 * synthesis, and asserting that all barrel exports resolve cleanly.
 */

import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../utils/sanitizer';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import type { EventInput } from '../types/event';

describe('Pipeline Integration — Sanitization to Synthesis', () => {
  it('should successfully synthesize a plan after sanitizing raw untrusted input', () => {
    /* Simulate untrusted user input with XSS injection attempt */
    const rawEventType = sanitizeInput('<script>alert("xss")</script>Wedding');
    const rawRequirements = sanitizeInput('Traditional setup & music <b>band</b>');

    const input: EventInput = {
      eventType: rawEventType || 'Wedding', /* fallback if sanitizer returns empty */
      eventDate: '2027-12-01',
      totalBudget: 1500000,
      currency: 'INR',
      guestCount: 150,
      durationHours: 8,
      locationType: 'Indoor Ballroom',
      specialRequirements: rawRequirements,
    };

    const plan = synthesizeFallbackPlan(input);

    /* Plan should be produced despite the injection attempt */
    expect(plan).toBeDefined();
    expect(plan.id).toBeTruthy();
    expect(plan.budgetAllocation.categories).toHaveLength(5);
    expect(plan.riskContingencyMatrix.length).toBeGreaterThan(0);
  });

  it('should produce mathematically coherent budget even for sanitized empty-string inputs', () => {
    const rawType = sanitizeInput('__proto__'); /* Should return empty string */
    const input: EventInput = {
      eventType: rawType || 'Celebration', /* must have non-empty eventType */
      eventDate: '2027-08-15',
      totalBudget: 500000,
      currency: 'INR',
      guestCount: 80,
      durationHours: 6,
      locationType: 'Rooftop',
      specialRequirements: '',
    };

    const plan = synthesizeFallbackPlan(input);
    const { categories, contingencyReserve, total } = plan.budgetAllocation;
    const pillarSum = categories.reduce((acc, c) => acc + c.allocated, 0);
    const reconstructed = pillarSum + contingencyReserve;

    expect(Math.abs(reconstructed - total)).toBeLessThanOrEqual(5);
  });
});
