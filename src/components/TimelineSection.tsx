/**
 * @fileoverview Timeline section component for EventCraft AI.
 * Displays the ChronoPlanner run-of-show schedule with phase badges,
 * transition buffer callouts, and interactive milestone checkboxes.
 */

import React from 'react';
import { Clock, CheckCircle2, Circle, Timer } from 'lucide-react';
import type { TimelineItem } from '../types/event';

/**
 * Props interface for the TimelineSection component.
 * @property {TimelineItem[]} timeline - The ordered run-of-show timeline items.
 * @property {(index: number) => void} onToggle - Callback to toggle milestone completion.
 */
interface TimelineSectionProps {
  timeline: TimelineItem[];
  onToggle: (index: number) => void;
}

/**
 * Maps phase names to CSS class suffixes for color-coded badges.
 * @param {string} phase - The timeline phase name.
 * @returns {string} The CSS class suffix for the phase badge.
 */
function getPhaseClass(phase: string): string {
  const lower = phase.toLowerCase();
  if (lower.includes('arrival')) return 'arrival';
  if (lower.includes('ceremony') || lower.includes('core')) return 'ceremony';
  if (lower.includes('reception')) return 'reception';
  if (lower.includes('wrap')) return 'wrapup';
  return 'default';
}

/**
 * ChronoPlanner Run-of-Show section displaying chronological activity cards
 * with phase badges, friction-damped transition buffer callouts,
 * and interactive milestone completion checkboxes.
 * @param {TimelineSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered timeline section.
 */
export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline, onToggle }) => {
  const completedCount = timeline.filter((t) => t.completed).length;
  const progressPct = timeline.length > 0 ? Math.round((completedCount / timeline.length) * 100) : 0;

  return (
    <section className="plan-section" aria-labelledby="timeline-heading">
      <div className="section-header">
        <Clock className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="timeline-heading">ChronoPlanner Run-of-Show</h2>
          <p className="section-subtitle">
            Friction-Damped Schedule · {completedCount}/{timeline.length} milestones · {progressPct}% complete
          </p>
        </div>
      </div>

      <div className="timeline-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Timeline completion progress">
        <div className="timeline-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="timeline-list">
        {timeline.map((item, index) => (
          <div key={`timeline-${index}`} className={`timeline-card ${item.completed ? 'completed' : ''}`}>
            <div className="timeline-card-left">
              <button
                className="timeline-checkbox"
                onClick={() => onToggle(index)}
                type="button"
                aria-label={`Mark "${item.activity}" as ${item.completed ? 'incomplete' : 'complete'}`}
              >
                {item.completed ? (
                  <CheckCircle2 size={22} className="check-icon completed-icon" aria-hidden="true" />
                ) : (
                  <Circle size={22} className="check-icon" aria-hidden="true" />
                )}
              </button>
              <div className="timeline-connector" aria-hidden="true" />
            </div>

            <div className="timeline-card-content">
              <div className="timeline-card-top">
                <span className="timeline-time">{item.time}</span>
                <span className={`timeline-phase phase-${getPhaseClass(item.phase)}`}>{item.phase}</span>
              </div>
              <h3 className="timeline-activity">{item.activity}</h3>
              <p className="timeline-details">{item.details}</p>
              <div className="timeline-buffer" aria-label={`${item.bufferMinutes} minute transition buffer`}>
                <Timer size={12} aria-hidden="true" />
                <span>{item.bufferMinutes}m transition buffer</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
