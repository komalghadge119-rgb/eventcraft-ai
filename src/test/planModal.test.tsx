/**
 * @fileoverview Component tests for PlanModal.
 * Tests form input validation, error displays, accessibility attributes, and submission.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlanModal } from '../components/PlanModal';

describe('PlanModal Component', () => {
  it('renders modal dialog when isOpen is true', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<PlanModal isOpen={true} onClose={onClose} onSubmit={onSubmit} loading={false} />);

    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Synthesize New Blueprint')).toBeTruthy();
  });

  it('does not render when isOpen is false', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<PlanModal isOpen={false} onClose={onClose} onSubmit={onSubmit} loading={false} />);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('displays validation errors when submitting with empty date', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<PlanModal isOpen={true} onClose={onClose} onSubmit={onSubmit} loading={false} />);

    const submitBtn = screen.getByRole('button', { name: /Generate Blueprint/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/Event date is required/i).length).toBeGreaterThan(0);
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits successfully when required fields are populated', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PlanModal isOpen={true} onClose={onClose} onSubmit={onSubmit} loading={false} />);

    const dateInput = screen.getByLabelText(/Event Date/i);
    fireEvent.change(dateInput, { target: { value: '2027-05-20' } });

    const submitBtn = screen.getByRole('button', { name: /Generate Blueprint/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          eventDate: '2027-05-20',
        }),
      );
    });
  });

  it('closes on Escape key press', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<PlanModal isOpen={true} onClose={onClose} onSubmit={onSubmit} loading={false} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
