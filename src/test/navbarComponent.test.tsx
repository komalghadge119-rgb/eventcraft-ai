/**
 * @fileoverview Component tests for Navbar.
 * Tests brand lockup, presets dropdown, export menu triggers, and API key modal.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../components/Navbar';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';

describe('Navbar Component', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  it('renders application brand lockup and action buttons', () => {
    const onLoadPreset = vi.fn();
    const onOpenSynthesizer = vi.fn();
    render(<Navbar onLoadPreset={onLoadPreset} onOpenSynthesizer={onOpenSynthesizer} plan={plan} />);

    expect(screen.getByText('EventCraft AI')).toBeTruthy();
    expect(screen.getByText('Presets')).toBeTruthy();
    expect(screen.getByText('Synthesize Blueprint')).toBeTruthy();
    expect(screen.getByText('Export')).toBeTruthy();
  });

  it('toggles presets dropdown menu and loads selected preset', () => {
    const onLoadPreset = vi.fn();
    const onOpenSynthesizer = vi.fn();
    render(<Navbar onLoadPreset={onLoadPreset} onOpenSynthesizer={onOpenSynthesizer} plan={plan} />);

    const presetsBtn = screen.getByText('Presets');
    fireEvent.click(presetsBtn);

    const royalWeddingItem = screen.getByText('Grand Jaipur Heritage Royal Wedding');
    expect(royalWeddingItem).toBeTruthy();
    fireEvent.click(royalWeddingItem);

    expect(onLoadPreset).toHaveBeenCalledWith('royal_wedding');
  });

  it('opens API key configuration modal when clicking API Key button', () => {
    const onLoadPreset = vi.fn();
    const onOpenSynthesizer = vi.fn();
    render(<Navbar onLoadPreset={onLoadPreset} onOpenSynthesizer={onOpenSynthesizer} plan={plan} />);

    const keyBtn = screen.getByLabelText(/Configure Gemini API key/i);
    fireEvent.click(keyBtn);

    expect(screen.getByRole('dialog', { name: /Configure Gemini API Key/i })).toBeTruthy();
  });
});
