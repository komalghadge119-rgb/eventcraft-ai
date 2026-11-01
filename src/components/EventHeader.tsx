/**
 * @fileoverview Hero event banner component for EventCraft AI.
 * Displays event title, tagline, metadata pills, live countdown timer,
 * and architectural color palette with 1-click copy functionality.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Clock, MapPin, Shirt, Calendar, Copy, Check } from 'lucide-react';
import type { EventPlan } from '../types/event';

/**
 * Props interface for the EventHeader component.
 * @property {EventPlan} plan - The event plan to display in the hero banner.
 */
interface EventHeaderProps {
  plan: EventPlan;
}

/** Milliseconds per day constant for countdown computation. */
const MS_PER_DAY = 86_400_000;
/** Milliseconds per hour constant for countdown computation. */
const MS_PER_HOUR = 3_600_000;
/** Milliseconds per minute constant for countdown computation. */
const MS_PER_MINUTE = 60_000;

/**
 * Computes the countdown string from the current date to the event date.
 * Pure calculation function kept outside the render path for efficiency.
 * @param {string | undefined} eventDate - The target event date in YYYY-MM-DD format.
 * @returns {string} Human-readable countdown string or completion status.
 */
function computeCountdown(eventDate: string | undefined): string {
  if (!eventDate) return 'Date TBD';
  const target = new Date(eventDate);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return '🎉 Event Complete!';

  const days = Math.floor(diffMs / MS_PER_DAY);
  const hours = Math.floor((diffMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((diffMs % MS_PER_HOUR) / MS_PER_MINUTE);

  if (days > 0) return `T-minus ${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `T-minus ${hours}h ${minutes}m`;
  return `T-minus ${minutes}m`;
}

/**
 * Hero event banner displaying the event title, tagline, key metadata,
 * live countdown timer, and an interactive 4-swatch color palette.
 * @param {EventHeaderProps} props - The component props.
 * @returns {React.ReactElement} The rendered hero banner.
 */
export const EventHeader: React.FC<EventHeaderProps> = ({ plan }) => {
  const [countdown, setCountdown] = useState(() => computeCountdown(plan.eventDate));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /* Update countdown every 60 seconds */
  useEffect(() => {
    setCountdown(computeCountdown(plan.eventDate));
    const interval = setInterval(() => {
      setCountdown(computeCountdown(plan.eventDate));
    }, 60000);
    return () => clearInterval(interval);
  }, [plan.eventDate]);

  const metaPills = useMemo(() => [
    { icon: Users, label: `${plan.guestCount} Guests`, id: 'guests' },
    { icon: Clock, label: `${plan.durationHours}h Duration`, id: 'duration' },
    { icon: MapPin, label: plan.locationType, id: 'location' },
    { icon: Shirt, label: plan.eventSummary.dressCode, id: 'dresscode' },
  ], [plan.guestCount, plan.durationHours, plan.locationType, plan.eventSummary.dressCode]);

  /**
   * Copies a HEX color code to the clipboard and shows visual confirmation.
   * @param {string} hex - The HEX color code to copy.
   * @param {number} index - The swatch index for visual feedback.
   */
  const handleCopyColor = useCallback(async (hex: string, index: number): Promise<void> => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      /* Clipboard API may be unavailable in some environments */
    }
  }, []);

  return (
    <header className="event-header">
      <div className="event-header-bg">
        <div className="event-header-gradient" />
      </div>

      <div className="event-header-content">
        <div className="event-header-top">
          <span className="event-type-badge">{plan.eventType}</span>
          <span className="event-countdown-badge" aria-live="polite" aria-label="Event countdown timer">
            <Calendar size={14} aria-hidden="true" />
            {countdown}
          </span>
        </div>

        <h1 className="event-title">{plan.eventSummary.title}</h1>
        <p className="event-tagline">&ldquo;{plan.eventSummary.tagline}&rdquo;</p>
        <p className="event-concept">{plan.eventSummary.themeConcept}</p>

        {/* Metadata Pills */}
        <div className="event-meta-pills" role="list" aria-label="Event metadata">
          {metaPills.map((pill) => (
            <div key={pill.id} className="meta-pill" role="listitem">
              <pill.icon size={14} aria-hidden="true" />
              <span>{pill.label}</span>
            </div>
          ))}
        </div>

        {/* Architectural Color Palette */}
        <div className="color-palette-section">
          <span className="palette-label">Architectural Palette</span>
          <ul className="color-palette" aria-label="Event color palette">
            {plan.eventSummary.colorPalette.map((hex, index) => (
              <li key={`${hex}-${index}`} className="color-swatch-item">
                <button
                  className="color-swatch"
                  style={{ backgroundColor: hex }}
                  onClick={() => handleCopyColor(hex, index)}
                  type="button"
                  aria-label={`Copy color ${hex} to clipboard`}
                  title={hex}
                >
                  <span className="swatch-overlay">
                    {copiedIndex === index ? (
                      <Check size={14} aria-hidden="true" />
                    ) : (
                      <Copy size={14} aria-hidden="true" />
                    )}
                  </span>
                  <span className="swatch-hex">{hex}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {plan.eventDate && (
          <div className="event-date-display">
            <Calendar size={16} aria-hidden="true" />
            <span>{new Date(plan.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        )}
      </div>
    </header>
  );
};
