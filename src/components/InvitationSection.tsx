/**
 * @fileoverview Invitation studio section component for EventCraft AI.
 * Displays dual-channel invitation copy with 1-click copy buttons
 * and celebratory confetti bursts on successful copy.
 */

import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { InvitationStudio } from '../types/event';

/**
 * Props interface for the InvitationSection component.
 * @property {InvitationStudio} invitation - The dual-channel invitation copy data.
 */
interface InvitationSectionProps {
  invitation: InvitationStudio;
}

/**
 * AI Theme & Invitation Studio section displaying dual-channel copy
 * generation cards with 1-click copy buttons that trigger celebratory
 * confetti bursts using canvas-confetti.
 * @param {InvitationSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered invitation section.
 */
export const InvitationSection: React.FC<InvitationSectionProps> = ({ invitation }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  /**
   * Copies text to clipboard, triggers confetti burst, and shows visual confirmation.
   * @param {string} text - The text to copy to the clipboard.
   * @param {string} field - The field identifier for visual feedback tracking.
   */
  const handleCopy = async (text: string, field: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);

      /* Celebratory confetti burst */
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#b48c48', '#faf8f5', '#1c1917'],
      });

      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      /* Clipboard API may not be available in all environments */
    }
  };

  return (
    <section className="plan-section" aria-labelledby="invitation-heading">
      <div className="section-header">
        <Mail className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="invitation-heading">AI Theme &amp; Invitation Studio</h2>
          <p className="section-subtitle">Dual-Channel Copy Generation with 1-Click Distribution</p>
        </div>
      </div>

      <div className="invitation-grid">
        {/* Formal Invitation Card */}
        <div className="invitation-card">
          <div className="invitation-card-header">
            <Mail size={18} aria-hidden="true" />
            <h3 className="invitation-card-title">Formal Digital Invitation</h3>
          </div>
          <p className="invitation-text">{invitation.formalInvitation}</p>
          <button
            className={`invitation-copy-btn ${copiedField === 'formal' ? 'copied' : ''}`}
            onClick={() => handleCopy(invitation.formalInvitation, 'formal')}
            type="button"
            aria-label="Copy formal invitation text to clipboard"
          >
            {copiedField === 'formal' ? (
              <>
                <Check size={14} aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* WhatsApp Broadcast Card */}
        <div className="invitation-card invitation-card-whatsapp">
          <div className="invitation-card-header">
            <MessageSquare size={18} aria-hidden="true" />
            <h3 className="invitation-card-title">WhatsApp / Social Broadcast</h3>
          </div>
          <pre className="invitation-text invitation-text-whatsapp">{invitation.casualWhatsAppCopy}</pre>
          <button
            className={`invitation-copy-btn ${copiedField === 'whatsapp' ? 'copied' : ''}`}
            onClick={() => handleCopy(invitation.casualWhatsAppCopy, 'whatsapp')}
            type="button"
            aria-label="Copy WhatsApp broadcast text to clipboard"
          >
            {copiedField === 'whatsapp' ? (
              <>
                <Check size={14} aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {/* RSVP Call-to-Action Card */}
        <div className="invitation-card invitation-card-rsvp">
          <div className="invitation-card-header">
            <PartyPopper size={18} aria-hidden="true" />
            <h3 className="invitation-card-title">RSVP Call-to-Action</h3>
          </div>
          <p className="invitation-text">{invitation.rsvpCallToAction}</p>
          <button
            className={`invitation-copy-btn ${copiedField === 'rsvp' ? 'copied' : ''}`}
            onClick={() => handleCopy(invitation.rsvpCallToAction, 'rsvp')}
            type="button"
            aria-label="Copy RSVP call-to-action text to clipboard"
          >
            {copiedField === 'rsvp' ? (
              <>
                <Check size={14} aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                <span>Copy to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
