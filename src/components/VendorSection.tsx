/**
 * @fileoverview Vendor procurement section component for EventCraft AI.
 * Displays the vendor checklist with SLA clauses, priority badges,
 * deadline tracking, and an interactive completion progress gauge.
 */

import React from 'react';
import { ClipboardList, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import type { VendorTask } from '../types/event';

/**
 * Props interface for the VendorSection component.
 * @property {VendorTask[]} vendors - The vendor procurement task list.
 * @property {(id: string) => void} onToggle - Callback to toggle task completion.
 */
interface VendorSectionProps {
  vendors: VendorTask[];
  onToggle: (id: string) => void;
}

/**
 * Maps priority level to CSS class suffix for color-coded badges.
 * @param {string} priority - The priority level (High, Medium, Low).
 * @returns {string} The CSS class suffix.
 */
function getPriorityClass(priority: string): string {
  switch (priority) {
    case 'High': return 'high';
    case 'Medium': return 'medium';
    case 'Low': return 'low';
    default: return 'medium';
  }
}

/**
 * Vendor Procurement Matrix section displaying the critical-path checklist
 * with SLA negotiation clauses, priority severity badges, deadline timelines,
 * and a progress gauge showing percentage of vendor contracts locked.
 * @param {VendorSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered vendor section.
 */
export const VendorSection: React.FC<VendorSectionProps> = ({ vendors, onToggle }) => {
  const completedCount = vendors.filter((v) => v.completed).length;
  const progressPct = vendors.length > 0 ? Math.round((completedCount / vendors.length) * 100) : 0;

  /* Group vendors by category */
  const grouped: Record<string, VendorTask[]> = {};
  for (const vendor of vendors) {
    const key = vendor.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(vendor);
  }

  return (
    <section className="plan-section" aria-labelledby="vendor-heading">
      <div className="section-header">
        <ClipboardList className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="vendor-heading">Vendor Procurement Matrix</h2>
          <p className="section-subtitle">
            {completedCount}/{vendors.length} contracts locked · {progressPct}% procurement complete
          </p>
        </div>
      </div>

      <div className="vendor-progress-bar" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Vendor procurement progress">
        <div className="vendor-progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="vendor-grid">
        {Object.entries(grouped).map(([category, tasks]) => (
          <div key={category} className="vendor-category-group">
            <h3 className="vendor-category-title">{category}</h3>
            {tasks.map((vendor) => (
              <div key={vendor.id} className={`vendor-card ${vendor.completed ? 'completed' : ''}`}>
                <div className="vendor-card-top">
                  <button
                    className="vendor-checkbox"
                    onClick={() => onToggle(vendor.id)}
                    type="button"
                    aria-label={`Mark "${vendor.task}" as ${vendor.completed ? 'incomplete' : 'complete'}`}
                  >
                    {vendor.completed ? (
                      <CheckSquare size={18} className="vendor-check completed-icon" aria-hidden="true" />
                    ) : (
                      <Square size={18} className="vendor-check" aria-hidden="true" />
                    )}
                  </button>
                  <div className="vendor-card-info">
                    <span className="vendor-task-text">{vendor.task}</span>
                    <div className="vendor-meta">
                      <span className={`vendor-priority priority-${getPriorityClass(vendor.priority)}`}>
                        {vendor.priority}
                      </span>
                      <span className="vendor-deadline">{vendor.deadlineWeeksBefore}w before event</span>
                    </div>
                  </div>
                </div>
                <div className="vendor-negotiation">
                  <AlertTriangle size={12} aria-hidden="true" />
                  <span>{vendor.negotiationCheck}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
