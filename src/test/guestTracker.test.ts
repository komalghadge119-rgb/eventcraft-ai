/**
 * @fileoverview Guest tracker tests for AuraPlan AI.
 * Validates attendee headcount arithmetic with plus-ones,
 * deterministic RSVP state transitions, and dietary alert identification.
 */

import { describe, it, expect } from 'vitest';
import { computeGuestStats, hasDietaryAlert } from '../components/GuestTrackerSection';
import type { GuestItem } from '../types/event';

const sampleGuests: GuestItem[] = [
  { id: 'g1', name: 'Alice', category: 'VIP', rsvpStatus: 'Confirmed', plusOnes: 2, dietary: 'Vegan' },
  { id: 'g2', name: 'Bob', category: 'Family', rsvpStatus: 'Confirmed', plusOnes: 1, dietary: 'No restrictions' },
  { id: 'g3', name: 'Carol', category: 'General', rsvpStatus: 'Pending', plusOnes: 0, dietary: 'Jain' },
  { id: 'g4', name: 'Dave', category: 'General', rsvpStatus: 'Declined', plusOnes: 1, dietary: 'Gluten-Free' },
];

describe('Guest Tracker — computeGuestStats', () => {
  it('should count confirmed guests correctly', () => {
    const { confirmed } = computeGuestStats(sampleGuests);
    expect(confirmed).toBe(2);
  });

  it('should count pending guests correctly', () => {
    const { pending } = computeGuestStats(sampleGuests);
    expect(pending).toBe(1);
  });

  it('should count declined guests correctly', () => {
    const { declined } = computeGuestStats(sampleGuests);
    expect(declined).toBe(1);
  });

  it('should compute total headcount including plus-ones for confirmed+pending guests', () => {
    /* Confirmed: Alice (1+2=3) + Bob (1+1=2) = 5; Pending: Carol (1+0=1); Declined excluded */
    const { totalHeadcount } = computeGuestStats(sampleGuests);
    expect(totalHeadcount).toBe(6);
  });

  it('should count dietary alerts correctly', () => {
    const { dietaryAlerts } = computeGuestStats(sampleGuests);
    /* Vegan (Alice) + Jain (Carol) + Gluten-Free (Dave) = 3 */
    expect(dietaryAlerts).toBe(3);
  });
});

describe('Guest Tracker — hasDietaryAlert', () => {
  it('should detect Vegan as a dietary alert', () => {
    expect(hasDietaryAlert('Vegan')).toBe(true);
  });

  it('should detect Jain as a dietary alert', () => {
    expect(hasDietaryAlert('Jain')).toBe(true);
  });

  it('should detect Gluten-Free as a dietary alert', () => {
    expect(hasDietaryAlert('Gluten-Free')).toBe(true);
  });

  it('should not flag "No restrictions" as a dietary alert', () => {
    expect(hasDietaryAlert('No restrictions')).toBe(false);
  });
});
