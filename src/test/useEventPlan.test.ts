/**
 * @fileoverview Unit and state integration tests for the useEventPlan custom hook.
 * Tests initial state, preset loading, timeline toggling, vendor tracking, RSVP cycling,
 * guest addition, idea favoriting, and budget expenditure tracking using renderHook and act.
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEventPlan } from '../hooks/useEventPlan';
import type { GuestItem } from '../types/event';

describe('useEventPlan Custom Hook', () => {
  it('initializes with null plan and idle loading state', () => {
    const { result } = renderHook(() => useEventPlan());
    expect(result.current.plan).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('loads a preset plan into state correctly', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    expect(result.current.plan).toBeDefined();
    expect(result.current.plan?.eventType).toBe('Royal Heritage Wedding');
    expect(result.current.plan?.guestCount).toBe(350);
    expect(result.current.plan?.budgetAllocation.total).toBe(3500000);
  });

  it('toggles timeline item milestone completion status', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    const initialStatus = result.current.plan?.timelineItinerary[0].completed;

    act(() => {
      result.current.toggleTimelineItem(0);
    });

    expect(result.current.plan?.timelineItinerary[0].completed).toBe(!initialStatus);
  });

  it('toggles vendor procurement task completion status', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    const targetId = result.current.plan?.vendorChecklist[0].id ?? 'v1';

    act(() => {
      result.current.toggleVendorTask(targetId);
    });

    const updatedTask = result.current.plan?.vendorChecklist.find((v) => v.id === targetId);
    expect(updatedTask?.completed).toBe(true);
  });

  it('cycles guest RSVP status: Confirmed -> Pending -> Declined -> Confirmed', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    const firstGuest = result.current.plan?.guestList?.[0];
    const guestId = firstGuest?.id ?? 'g1';

    act(() => {
      result.current.cycleGuestRsvp(guestId);
    });

    const updatedGuest = result.current.plan?.guestList?.find((g) => g.id === guestId);
    expect(updatedGuest?.rsvpStatus).toBe('Pending');
  });

  it('adds a new guest to the plan guest list', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    const initialCount = result.current.plan?.guestList?.length ?? 0;
    const newGuest: GuestItem = {
      id: 'g-custom-1',
      name: 'Rohan Mehra',
      category: 'VIP',
      rsvpStatus: 'Confirmed',
      plusOnes: 1,
      dietary: 'Nut Allergy',
    };

    act(() => {
      result.current.addGuest(newGuest);
    });

    expect(result.current.plan?.guestList?.length).toBe(initialCount + 1);
    expect(result.current.plan?.guestList?.some((g) => g.name === 'Rohan Mehra')).toBe(true);
  });

  it('updates actual spent expenditure for budget categories', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    act(() => {
      result.current.updateActualSpent(750000, 0);
    });

    expect(result.current.plan?.budgetAllocation.categories[0].actualSpent).toBe(750000);
  });

  it('toggles favorited status of personalized ideas', () => {
    const { result } = renderHook(() => useEventPlan());

    act(() => {
      result.current.loadPreset('royal_wedding');
    });

    const firstIdeaId = result.current.plan?.personalizedIdeas[0].id ?? 'idea-w1';
    const initialFav = result.current.plan?.personalizedIdeas[0].isFavorited;

    act(() => {
      result.current.toggleIdeaFavorite(firstIdeaId);
    });

    const updatedIdea = result.current.plan?.personalizedIdeas.find((i) => i.id === firstIdeaId);
    expect(updatedIdea?.isFavorited).toBe(!initialFav);
  });
});
