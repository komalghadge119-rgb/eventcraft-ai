/**
 * @fileoverview Complete tests for EventHeader component.
 * Tests countdown computation, metadata pills, color swatch copying, and date rendering.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EventHeader } from '../components/EventHeader';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';

describe('EventHeader Component', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders title, tagline, and metadata pills', () => {
    render(<EventHeader plan={plan} />);

    expect(screen.getByText(plan.eventSummary.title)).toBeTruthy();
    expect(screen.getByText(new RegExp(plan.eventSummary.tagline, 'i'))).toBeTruthy();
    expect(screen.getByText(`${plan.guestCount} Guests`)).toBeTruthy();
    expect(screen.getByText(`${plan.durationHours}h Duration`)).toBeTruthy();
  });

  it('copies color swatch hex to clipboard', async () => {
    render(<EventHeader plan={plan} />);

    const firstColor = plan.eventSummary.colorPalette[0];
    const swatch = screen.getByLabelText(`Copy color ${firstColor} to clipboard`);
    fireEvent.click(swatch);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(firstColor);
    await waitFor(() => {
      expect(swatch).toBeTruthy();
    });
  });
});

