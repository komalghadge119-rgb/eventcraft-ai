/**
 * @fileoverview Custom React hook for managing event plan state in AuraPlan AI.
 * Handles plan creation, preset switching, guest management, and state transitions.
 */

import { useState, useCallback } from 'react';
import type { EventPlan, EventInput, GuestItem } from '../types/event';
import { generateEventPlan } from '../services/aiService';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_MAP } from '../constants';
import { logger } from '../utils/logger';

/**
 * Return type for the useEventPlan custom hook.
 * @property {EventPlan | null} plan - The current active event plan.
 * @property {boolean} loading - Whether a plan generation is in progress.
 * @property {string | null} error - Error message if generation failed.
 * @property {(input: EventInput) => Promise<void>} generatePlan - Generates a new plan from input.
 * @property {(presetKey: string) => void} loadPreset - Loads a plan from a preset configuration.
 * @property {(index: number) => void} toggleTimelineItem - Toggles timeline item completion.
 * @property {(id: string) => void} toggleVendorTask - Toggles vendor task completion.
 * @property {(id: string) => void} cycleGuestRsvp - Cycles guest RSVP status.
 * @property {(guest: GuestItem) => void} addGuest - Adds a new guest to the plan.
 * @property {(spent: number, categoryIndex: number) => void} updateActualSpent - Updates budget tracking.
 */
export interface UseEventPlanReturn {
  plan: EventPlan | null;
  loading: boolean;
  error: string | null;
  generatePlan: (input: EventInput) => Promise<void>;
  loadPreset: (presetKey: string) => void;
  toggleTimelineItem: (index: number) => void;
  toggleVendorTask: (id: string) => void;
  toggleIdeaFavorite: (id: string) => void;
  cycleGuestRsvp: (id: string) => void;
  addGuest: (guest: GuestItem) => void;
  updateActualSpent: (spent: number, categoryIndex: number) => void;
}

/**
 * Custom React hook for comprehensive event plan state management.
 * Provides plan generation, preset loading, and interactive state mutations
 * for timeline, vendor, guest, and budget tracking.
 * @returns {UseEventPlanReturn} The plan state and mutation functions.
 */
export function useEventPlan(): UseEventPlanReturn {
  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generates a new event plan from user input via AI or fallback.
   * @param {EventInput} input - The event configuration input.
   */
  const generatePlan = useCallback(async (input: EventInput): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newPlan = await generateEventPlan(input);
      setPlan(newPlan);
      logger.info('Plan generated successfully', { id: newPlan.id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Plan generation failed.';
      setError(msg);
      logger.error('Plan generation error', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Loads a plan from a preset configuration key using the deterministic synthesizer.
   * @param {string} presetKey - The preset key from PRESET_MAP.
   */
  const loadPreset = useCallback((presetKey: string): void => {
    const presetInput = PRESET_MAP[presetKey];
    if (!presetInput) {
      logger.warn('Unknown preset key', presetKey);
      return;
    }
    const newPlan = synthesizeFallbackPlan(presetInput);
    setPlan(newPlan);
    logger.info('Preset loaded', { presetKey, id: newPlan.id });
  }, []);

  /**
   * Toggles the completion status of a timeline item at the given index.
   * @param {number} index - The zero-based index of the timeline item.
   */
  const toggleTimelineItem = useCallback((index: number): void => {
    setPlan((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.timelineItinerary = [...prev.timelineItinerary];
      updated.timelineItinerary[index] = {
        ...updated.timelineItinerary[index],
        completed: !updated.timelineItinerary[index].completed,
      };
      return updated;
    });
  }, []);

  /**
   * Toggles the completion status of a vendor task by ID.
   * @param {string} id - The vendor task identifier.
   */
  const toggleVendorTask = useCallback((id: string): void => {
    setPlan((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.vendorChecklist = prev.vendorChecklist.map((v) =>
        v.id === id ? { ...v, completed: !v.completed } : v
      );
      return updated;
    });
  }, []);

  /**
   * Cycles a guest's RSVP status: Confirmed → Pending → Declined → Confirmed.
   * @param {string} id - The guest identifier.
   */
  const cycleGuestRsvp = useCallback((id: string): void => {
    setPlan((prev) => {
      if (!prev || !prev.guestList) return prev;
      const statusCycle: Record<string, 'Confirmed' | 'Pending' | 'Declined'> = {
        Confirmed: 'Pending',
        Pending: 'Declined',
        Declined: 'Confirmed',
      };
      const updated = { ...prev };
      updated.guestList = prev.guestList.map((g) =>
        g.id === id ? { ...g, rsvpStatus: statusCycle[g.rsvpStatus] || 'Pending' } : g
      );
      return updated;
    });
  }, []);

  /**
   * Adds a new guest to the plan's guest list.
   * @param {GuestItem} guest - The guest entry to add.
   */
  const addGuest = useCallback((guest: GuestItem): void => {
    setPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        guestList: [...(prev.guestList || []), guest],
      };
    });
  }, []);

  /**
   * Updates the actual spent amount for a budget category.
   * @param {number} spent - The new actual spent amount.
   * @param {number} categoryIndex - The index of the budget category to update.
   */
  const updateActualSpent = useCallback((spent: number, categoryIndex: number): void => {
    setPlan((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      updated.budgetAllocation = { ...prev.budgetAllocation };
      updated.budgetAllocation.categories = prev.budgetAllocation.categories.map((c, i) =>
        i === categoryIndex ? { ...c, actualSpent: spent } : c
      );
      return updated;
    });
  }, []);

  /**
   * Toggles the favorited/shortlisted status of a personalized creative idea.
   * @param {string} id - The personalized idea identifier.
   */
  const toggleIdeaFavorite = useCallback((id: string): void => {
    setPlan((prev) => {
      if (!prev || !prev.personalizedIdeas) return prev;
      const updated = { ...prev };
      updated.personalizedIdeas = prev.personalizedIdeas.map((idea) =>
        idea.id === id ? { ...idea, isFavorited: !idea.isFavorited } : idea
      );
      return updated;
    });
  }, []);

  return {
    plan,
    loading,
    error,
    generatePlan,
    loadPreset,
    toggleTimelineItem,
    toggleVendorTask,
    toggleIdeaFavorite,
    cycleGuestRsvp,
    addGuest,
    updateActualSpent,
  };
}
