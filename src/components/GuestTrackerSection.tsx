/**
 * @fileoverview Guest tracker section component for AuraPlan AI.
 * Displays the Guest & RSVP Operations Matrix with KPI counters,
 * dietary triage alerts, interactive status cycling, and quick-add form.
 */

import React, { useState, useMemo } from 'react';
import { Users, UserPlus, AlertCircle, CheckCircle, Clock as ClockIcon, XCircle, Utensils } from 'lucide-react';
import type { GuestItem } from '../types/event';
import { DIETARY_ALERT_KEYWORDS } from '../constants';

/**
 * Props interface for the GuestTrackerSection component.
 * @property {GuestItem[]} guests - The current guest list array.
 * @property {(id: string) => void} onCycleRsvp - Callback to cycle a guest's RSVP status.
 * @property {(guest: GuestItem) => void} onAddGuest - Callback to add a new guest.
 */
interface GuestTrackerSectionProps {
  guests: GuestItem[];
  onCycleRsvp: (id: string) => void;
  onAddGuest: (guest: GuestItem) => void;
}

/**
 * Checks if a dietary string contains any alert-triggering keywords.
 * @param {string} dietary - The guest's dietary requirements string.
 * @returns {boolean} True if the dietary string contains an alert keyword.
 */
export function hasDietaryAlert(dietary: string): boolean {
  const lower = dietary.toLowerCase();
  return DIETARY_ALERT_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/**
 * Computes total headcount including plus-ones for confirmed guests.
 * @param {GuestItem[]} guests - The guest list array.
 * @returns {{ confirmed: number; pending: number; declined: number; totalHeadcount: number; dietaryAlerts: number }}
 */
export function computeGuestStats(guests: GuestItem[]): {
  confirmed: number;
  pending: number;
  declined: number;
  totalHeadcount: number;
  dietaryAlerts: number;
} {
  let confirmed = 0;
  let pending = 0;
  let declined = 0;
  let totalHeadcount = 0;
  let dietaryAlerts = 0;

  for (const guest of guests) {
    const headcount = 1 + guest.plusOnes;
    if (guest.rsvpStatus === 'Confirmed') {
      confirmed++;
      totalHeadcount += headcount;
    } else if (guest.rsvpStatus === 'Pending') {
      pending++;
      totalHeadcount += headcount;
    } else {
      declined++;
    }
    if (hasDietaryAlert(guest.dietary)) {
      dietaryAlerts++;
    }
  }

  return { confirmed, pending, declined, totalHeadcount, dietaryAlerts };
}

/**
 * Guest & RSVP Operations Matrix with live KPI counters, dietary triage alerts,
 * interactive RSVP status cycling, and a quick-add guest form.
 * @param {GuestTrackerSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered guest tracker section.
 */
export const GuestTrackerSection: React.FC<GuestTrackerSectionProps> = ({ guests, onCycleRsvp, onAddGuest }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState<{
    name: string;
    category: GuestItem['category'];
    dietary: string;
    plusOnes: number;
  }>({ name: '', category: 'General', dietary: '', plusOnes: 0 });

  const stats = useMemo(() => computeGuestStats(guests), [guests]);

  /**
   * Handles submission of the quick-add guest form.
   */
  const handleAddGuest = (): void => {
    if (!newGuest.name.trim()) return;
    const guest: GuestItem = {
      id: `g-${Date.now().toString(36)}`,
      name: newGuest.name.trim(),
      category: newGuest.category,
      rsvpStatus: 'Pending',
      plusOnes: newGuest.plusOnes,
      dietary: newGuest.dietary,
    };
    onAddGuest(guest);
    setNewGuest({ name: '', category: 'General', dietary: '', plusOnes: 0 });
    setShowAddForm(false);
  };

  /**
   * Returns CSS class for RSVP status badge styling.
   * @param {string} status - The RSVP status string.
   * @returns {string} The CSS class suffix.
   */
  const getRsvpClass = (status: string): string => {
    switch (status) {
      case 'Confirmed': return 'confirmed';
      case 'Pending': return 'pending';
      case 'Declined': return 'declined';
      default: return 'pending';
    }
  };

  return (
    <section className="plan-section" aria-labelledby="guest-heading">
      <div className="section-header">
        <Users className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="guest-heading">Guest &amp; RSVP Operations Matrix</h2>
          <p className="section-subtitle">Attendee Tracking with Dietary Triage &amp; Headcount Intelligence</p>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="guest-kpi-row" role="status" aria-label="Guest RSVP statistics">
        <div className="guest-kpi confirmed">
          <CheckCircle size={18} aria-hidden="true" />
          <div className="kpi-info">
            <span className="kpi-value">{stats.confirmed}</span>
            <span className="kpi-label">Confirmed</span>
          </div>
        </div>
        <div className="guest-kpi pending">
          <ClockIcon size={18} aria-hidden="true" />
          <div className="kpi-info">
            <span className="kpi-value">{stats.pending}</span>
            <span className="kpi-label">Pending</span>
          </div>
        </div>
        <div className="guest-kpi declined">
          <XCircle size={18} aria-hidden="true" />
          <div className="kpi-info">
            <span className="kpi-value">{stats.declined}</span>
            <span className="kpi-label">Declined</span>
          </div>
        </div>
        <div className="guest-kpi headcount">
          <Users size={18} aria-hidden="true" />
          <div className="kpi-info">
            <span className="kpi-value">{stats.totalHeadcount}</span>
            <span className="kpi-label">Total Headcount</span>
          </div>
        </div>
        {stats.dietaryAlerts > 0 && (
          <div className="guest-kpi dietary-alert">
            <Utensils size={18} aria-hidden="true" />
            <div className="kpi-info">
              <span className="kpi-value">{stats.dietaryAlerts}</span>
              <span className="kpi-label">Dietary Alerts</span>
            </div>
          </div>
        )}
      </div>

      {/* Guest Table */}
      <div className="guest-table-wrapper">
        <table className="guest-table" aria-label="Guest RSVP tracking table">
          <thead>
            <tr>
              <th scope="col">Guest Name</th>
              <th scope="col">Category</th>
              <th scope="col">RSVP Status</th>
              <th scope="col">+Ones</th>
              <th scope="col">Dietary</th>
              <th scope="col">Table</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className={guest.rsvpStatus === 'Declined' ? 'row-declined' : ''}>
                <td className="guest-name-cell">{guest.name}</td>
                <td>
                  <span className={`category-badge cat-${guest.category.toLowerCase()}`}>{guest.category}</span>
                </td>
                <td>
                  <button
                    className={`rsvp-badge rsvp-${getRsvpClass(guest.rsvpStatus)}`}
                    onClick={() => onCycleRsvp(guest.id)}
                    type="button"
                    aria-label={`Cycle RSVP status for ${guest.name}. Current: ${guest.rsvpStatus}`}
                  >
                    {guest.rsvpStatus}
                  </button>
                </td>
                <td className="plus-ones-cell">+{guest.plusOnes}</td>
                <td>
                  <span className={`dietary-cell ${hasDietaryAlert(guest.dietary) ? 'dietary-alert-text' : ''}`}>
                    {hasDietaryAlert(guest.dietary) && <AlertCircle size={12} aria-hidden="true" />}
                    {guest.dietary || '—'}
                  </span>
                </td>
                <td>{guest.tableNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick-Add Guest */}
      <div className="guest-add-section">
        {showAddForm ? (
          <div className="guest-add-form">
            <input
              type="text"
              className="form-input"
              placeholder="Guest name"
              value={newGuest.name}
              onChange={(e) => setNewGuest((prev) => ({ ...prev, name: e.target.value }))}
              aria-label="New guest name"
              id="new-guest-name"
            />
            <select
              className="form-select"
              value={newGuest.category}
              onChange={(e) => setNewGuest((prev) => ({ ...prev, category: e.target.value as GuestItem['category'] }))}
              aria-label="Guest category"
              id="new-guest-category"
            >
              <option value="VIP">VIP</option>
              <option value="Family">Family</option>
              <option value="General">General</option>
              <option value="Crew">Crew</option>
            </select>
            <input
              type="text"
              className="form-input"
              placeholder="Dietary needs"
              value={newGuest.dietary}
              onChange={(e) => setNewGuest((prev) => ({ ...prev, dietary: e.target.value }))}
              aria-label="Dietary requirements"
              id="new-guest-dietary"
            />
            <input
              type="number"
              className="form-input form-input-small"
              placeholder="+Ones"
              value={newGuest.plusOnes}
              onChange={(e) => setNewGuest((prev) => ({ ...prev, plusOnes: Number(e.target.value) || 0 }))}
              min={0}
              max={10}
              aria-label="Number of plus-ones"
              id="new-guest-plusones"
            />
            <button className="guest-add-btn" onClick={handleAddGuest} type="button" aria-label="Confirm add guest">
              Add
            </button>
            <button className="guest-cancel-btn" onClick={() => setShowAddForm(false)} type="button" aria-label="Cancel adding guest">
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="guest-add-trigger"
            onClick={() => setShowAddForm(true)}
            type="button"
            aria-label="Add a new guest to the RSVP list"
          >
            <UserPlus size={16} aria-hidden="true" />
            <span>Add Guest</span>
          </button>
        )}
      </div>
    </section>
  );
};
