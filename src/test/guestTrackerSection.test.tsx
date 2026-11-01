/**
 * @fileoverview Component tests for GuestTrackerSection.
 * Tests table rendering, quick-add form submission, cancellation, and RSVP status cycling.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GuestTrackerSection } from '../components/GuestTrackerSection';
import type { GuestItem } from '../types/event';

const mockGuests: GuestItem[] = [
  { id: 'g1', name: 'Aarav Sharma', category: 'VIP', rsvpStatus: 'Confirmed', plusOnes: 1, dietary: 'Vegan', tableNumber: 'T1' },
  { id: 'g2', name: 'Priya Patel', category: 'Family', rsvpStatus: 'Pending', plusOnes: 0, dietary: 'Jain' },
  { id: 'g3', name: 'Dev Anand', category: 'General', rsvpStatus: 'Declined', plusOnes: 0, dietary: 'No restrictions' },
];

describe('GuestTrackerSection Component', () => {
  it('renders guest rows with appropriate status badges', () => {
    const onCycle = vi.fn();
    const onAdd = vi.fn();
    render(<GuestTrackerSection guests={mockGuests} onCycleRsvp={onCycle} onAddGuest={onAdd} />);

    expect(screen.getByText('Aarav Sharma')).toBeTruthy();
    expect(screen.getByText('Priya Patel')).toBeTruthy();
    expect(screen.getAllByText('Confirmed').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Declined').length).toBeGreaterThan(0);
  });

  it('triggers onCycleRsvp when clicking RSVP badge', () => {
    const onCycle = vi.fn();
    const onAdd = vi.fn();
    render(<GuestTrackerSection guests={mockGuests} onCycleRsvp={onCycle} onAddGuest={onAdd} />);

    const cycleButton = screen.getByLabelText(/Cycle RSVP status for Aarav Sharma/i);
    fireEvent.click(cycleButton);
    expect(onCycle).toHaveBeenCalledWith('g1');
  });

  it('opens quick-add form and cancels successfully', () => {
    const onCycle = vi.fn();
    const onAdd = vi.fn();
    render(<GuestTrackerSection guests={mockGuests} onCycleRsvp={onCycle} onAddGuest={onAdd} />);

    const addTrigger = screen.getByText('Add Guest');
    fireEvent.click(addTrigger);

    expect(screen.getByPlaceholderText('Guest name')).toBeTruthy();
    const cancelBtn = screen.getByText('Cancel');
    fireEvent.click(cancelBtn);

    expect(screen.queryByPlaceholderText('Guest name')).toBeNull();
  });

  it('submits a new guest through the quick-add form', () => {
    const onCycle = vi.fn();
    const onAdd = vi.fn();
    render(<GuestTrackerSection guests={mockGuests} onCycleRsvp={onCycle} onAddGuest={onAdd} />);

    fireEvent.click(screen.getByLabelText(/Add a new guest/i));

    const nameInput = screen.getByPlaceholderText('Guest name');
    const dietaryInput = screen.getByPlaceholderText('Dietary needs');
    const plusOnesInput = screen.getByPlaceholderText('+Ones');

    fireEvent.change(nameInput, { target: { value: 'Neha Verma' } });
    fireEvent.change(dietaryInput, { target: { value: 'Gluten-Free' } });
    fireEvent.change(plusOnesInput, { target: { value: '2' } });

    fireEvent.click(screen.getByLabelText(/Confirm add guest/i));

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Neha Verma',
        dietary: 'Gluten-Free',
        plusOnes: 2,
        rsvpStatus: 'Pending',
      })
    );
  });
});
