/**
 * @fileoverview Execution and fallback tests for aiService.ts.
 * Tests API key session management, fallback synthesis, and edge-case handling.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getStoredApiKey, storeApiKey, generateEventPlan } from '../services/aiService';
import { SESSION_KEY_API } from '../constants';
import type { EventInput } from '../types/event';

describe('AI Service Execution & Storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('retrieves null when no API key is stored', () => {
    expect(getStoredApiKey()).toBeNull();
  });

  it('stores and retrieves an API key from sessionStorage', () => {
    storeApiKey('AIzaSyTestKey123');
    expect(sessionStorage.getItem(SESSION_KEY_API)).toBe('AIzaSyTestKey123');
    expect(getStoredApiKey()).toBe('AIzaSyTestKey123');
  });

  it('falls back to deterministic synthesizer when no API key is present', async () => {
    const input: EventInput = {
      eventType: 'Wedding',
      eventDate: '2027-04-15',
      totalBudget: 2000000,
      currency: 'INR',
      guestCount: 200,
      durationHours: 8,
      locationType: 'Palace Grounds',
      specialRequirements: 'Royal floral decor',
    };

    const plan = await generateEventPlan(input);
    expect(plan).toBeDefined();
    expect(plan.eventType).toBe('Wedding');
    expect(plan.budgetAllocation.total).toBe(2000000);
    expect(plan.budgetAllocation.contingencyReserve).toBe(240000);
    expect(plan.timelineItinerary.length).toBeGreaterThan(0);
    expect(plan.vendorChecklist.length).toBeGreaterThan(0);
    expect(plan.invitationStudio.formalInvitation).toContain('sacred union');
    expect(plan.personalizedIdeas.length).toBeGreaterThan(0);
  });
});
