/**
 * @fileoverview Pure utility functions for guest list and RSVP analytics.
 * Extracted from GuestTrackerSection to maximize modularity and code reuse.
 */

import type { GuestItem } from '../types/event';
import { DIETARY_ALERT_KEYWORDS } from '../constants';

/**
 * Checks if a dietary string contains any alert-triggering keywords.
 * @param {string} dietary - The guest's dietary requirements string.
 * @returns {boolean} True if the dietary string contains an alert keyword.
 */
export function hasDietaryAlert(dietary: string): boolean {
  const lower = dietary.toLowerCase();
  return DIETARY_ALERT_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/**
 * Computes total headcount including plus-ones for confirmed guests.
 * @param {GuestItem[]} guests - The guest list array.
 * @returns {{ confirmed: number; pending: number; declined: number; totalHeadcount: number; dietaryAlerts: number }}
 */
export function computeGuestStats(guests: GuestItem[]): {
  confirmed: number;
  pending: number;
  declined: number;
  totalHeadcount: number;
  dietaryAlerts: number;
} {
  let confirmed = 0;
  let pending = 0;
  let declined = 0;
  let totalHeadcount = 0;
  let dietaryAlerts = 0;

  for (const guest of guests) {
    const headcount = 1 + guest.plusOnes;
    if (guest.rsvpStatus === 'Confirmed') {
      confirmed++;
      totalHeadcount += headcount;
    } else if (guest.rsvpStatus === 'Pending') {
      pending++;
      totalHeadcount += headcount;
    } else {
      declined++;
    }
    if (hasDietaryAlert(guest.dietary)) {
      dietaryAlerts++;
    }
  }

  return { confirmed, pending, declined, totalHeadcount, dietaryAlerts };
}

/**
 * Returns CSS class for RSVP status badge styling.
 * @param {string} status - The RSVP status string.
 * @returns {string} The CSS class suffix.
 */
export function getRsvpClass(status: string): string {
  switch (status) {
    case 'Confirmed': return 'confirmed';
    case 'Pending': return 'pending';
    case 'Declined': return 'declined';
    default: return 'pending';
  }
}
