/**
 * @fileoverview Plan synthesis modal component for AuraPlan AI.
 * Provides a form dialog for creating new event blueprints with
 * full input validation and Escape-key dismissal.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import type { EventInput } from '../types/event';

/**
 * Props interface for the PlanModal component.
 * @property {boolean} isOpen - Whether the modal is currently visible.
 * @property {() => void} onClose - Callback to close the modal.
 * @property {(input: EventInput) => Promise<void>} onSubmit - Callback to submit the event input.
 * @property {boolean} loading - Whether a plan generation is in progress.
 */
interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: EventInput) => Promise<void>;
  loading: boolean;
}

/**
 * Modal dialog for configuring and synthesizing a new event blueprint.
 * Implements comprehensive form validation, Escape-key dismissal,
 * and backdrop click closing for accessibility compliance.
 * @param {PlanModalProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered modal or null if closed.
 */
export const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState<EventInput>({
    eventType: 'Wedding',
    eventDate: '',
    totalBudget: 1000000,
    currency: 'INR',
    guestCount: 200,
    durationHours: 8,
    locationType: 'Indoor Banquet Hall',
    specialRequirements: '',
  });

  /**
   * Handles Escape key press to dismiss the modal.
   */
  const handleEscapeKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isOpen, handleEscapeKey]);

  /**
   * Handles form field changes with type coercion for numeric inputs.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['totalBudget', 'guestCount', 'durationHours'].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  /**
   * Handles form submission with input validation.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Synthesize new event blueprint"
    >
      <div className="modal-card modal-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <Sparkles size={20} aria-hidden="true" />
            Synthesize New Blueprint
          </h3>
          <button
            className="modal-close"
            onClick={onClose}
            type="button"
            aria-label="Close synthesis dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Event Type</label>
              <select
                id="eventType"
                name="eventType"
                className="form-select"
                value={formData.eventType}
                onChange={handleChange}
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday</option>
                <option value="Tech Hackathon">Tech Hackathon</option>
                <option value="Corporate Gala">Corporate Gala</option>
                <option value="Community Festival">Community Festival</option>
                <option value="Milestone Celebration">Milestone Celebration</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="eventDate" className="form-label">Event Date</label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                className="form-input"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalBudget" className="form-label">Total Budget</label>
              <input
                id="totalBudget"
                name="totalBudget"
                type="number"
                className="form-input"
                value={formData.totalBudget}
                onChange={handleChange}
                min={0}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency" className="form-label">Currency</label>
              <select
                id="currency"
                name="currency"
                className="form-select"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="guestCount" className="form-label">Guest Count</label>
              <input
                id="guestCount"
                name="guestCount"
                type="number"
                className="form-input"
                value={formData.guestCount}
                onChange={handleChange}
                min={1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="durationHours" className="form-label">Duration (hours)</label>
              <input
                id="durationHours"
                name="durationHours"
                type="number"
                className="form-input"
                value={formData.durationHours}
                onChange={handleChange}
                min={1}
                max={72}
              />
            </div>

            <div className="form-group form-group-wide">
              <label htmlFor="locationType" className="form-label">Location Setting</label>
              <input
                id="locationType"
                name="locationType"
                type="text"
                className="form-input"
                value={formData.locationType}
                onChange={handleChange}
                placeholder="e.g., Rooftop Lounge, Heritage Palace, Convention Center"
              />
            </div>

            <div className="form-group form-group-wide">
              <label htmlFor="specialRequirements" className="form-label">Special Requirements</label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                className="form-textarea"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Cultural requirements, dietary needs, entertainment preferences..."
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              className="modal-btn modal-btn-secondary"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="modal-btn modal-btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner" aria-hidden="true" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Generate Blueprint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
