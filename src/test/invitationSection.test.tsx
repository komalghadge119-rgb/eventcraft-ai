/**
 * @fileoverview Component tests for InvitationSection.
 * Tests formal card rendering, WhatsApp copy, and clipboard copy interactions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvitationSection } from '../components/InvitationSection';
import type { InvitationStudio } from '../types/event';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const mockInvitation: InvitationStudio = {
  formalInvitation: 'Cordially inviting you to celebrate this royal union.',
  casualWhatsAppCopy: 'Hey friends! The big party is here! RSVP now!',
  rsvpCallToAction: 'Please RSVP by Friday.',
};

describe('InvitationSection Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders formal, WhatsApp, and RSVP copy', () => {
    render(<InvitationSection invitation={mockInvitation} />);

    expect(screen.getByText(/Cordially inviting you/i)).toBeTruthy();
    expect(screen.getByText(/Hey friends! The big party/i)).toBeTruthy();
    expect(screen.getByText(/Please RSVP by Friday/i)).toBeTruthy();
  });

  it('triggers clipboard copy when copy button is clicked', async () => {
    render(<InvitationSection invitation={mockInvitation} />);

    const copyBtn = screen.getByLabelText(/Copy formal invitation text/i);
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockInvitation.formalInvitation);
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeTruthy();
    });
  });
});
