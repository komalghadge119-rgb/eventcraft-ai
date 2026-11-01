/**
 * @fileoverview Risk Sentinel FMEA section component for EventCraft AI.
 * Displays the SENTINEL agent's Failure Mode & Effects Analysis grid
 * with probability/impact ratings, trigger conditions, and Plan B protocols.
 */

import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import type { RiskContingency } from '../types/event';

/**
 * Props interface for the RiskSentinelSection component.
 * @property {RiskContingency[]} risks - The FMEA risk matrix data from the SENTINEL agent.
 */
interface RiskSentinelSectionProps {
  risks: RiskContingency[];
}

/**
 * Returns CSS class suffix for probability level color coding.
 * @param {string} probability - The risk probability level.
 * @returns {string} The CSS class suffix.
 */
function getProbabilityClass(probability: string): string {
  switch (probability) {
    case 'High': return 'high';
    case 'Med': return 'medium';
    case 'Low': return 'low';
    default: return 'low';
  }
}

/**
 * Returns CSS class suffix for impact severity color coding.
 * @param {string} impact - The risk impact level.
 * @returns {string} The CSS class suffix.
 */
function getImpactClass(impact: string): string {
  switch (impact) {
    case 'Critical': return 'critical';
    case 'High': return 'high';
    case 'Med': return 'medium';
    case 'Low': return 'low';
    default: return 'low';
  }
}

/**
 * SENTINEL Risk FMEA Matrix section displaying failure mode analysis with
 * probability and impact severity ratings, measurable trigger conditions,
 * and automated Plan B execution protocols.
 * @param {RiskSentinelSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered risk sentinel section.
 */
export const RiskSentinelSection: React.FC<RiskSentinelSectionProps> = ({ risks }) => {
  const criticalRisks = risks.filter((r) => r.impact === 'Critical' || r.probability === 'High');

  return (
    <section className="plan-section" aria-labelledby="risk-heading">
      <div className="section-header">
        <Shield className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="risk-heading">Sentinel Risk FMEA Matrix</h2>
          <p className="section-subtitle">
            Failure Mode &amp; Effects Analysis · {risks.length} risks assessed · {criticalRisks.length} critical
          </p>
        </div>
      </div>

      {criticalRisks.length > 0 && (
        <div className="risk-critical-banner" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{criticalRisks.length} critical or high-probability risk{criticalRisks.length > 1 ? 's' : ''} require immediate contingency preparation.</span>
        </div>
      )}

      <div className="risk-grid">
        {risks.map((risk, index) => (
          <div key={`risk-${risk.risk}`} className={`risk-card impact-${getImpactClass(risk.impact)}`}>
            <div className="risk-card-header">
              <span className="risk-title">{risk.risk}</span>
              <div className="risk-badges">
                <span className={`risk-badge prob-${getProbabilityClass(risk.probability)}`}>
                  P: {risk.probability}
                </span>
                <span className={`risk-badge impact-badge impact-${getImpactClass(risk.impact)}`}>
                  I: {risk.impact}
                </span>
              </div>
            </div>

            <div className="risk-trigger">
              <span className="risk-trigger-label">⚡ Trigger Condition</span>
              <p className="risk-trigger-text">{risk.triggerCondition}</p>
            </div>

            <div className="risk-plan">
              <span className="risk-plan-label">🛡️ Plan B Protocol</span>
              <p className="risk-plan-text">{risk.contingencyPlan}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
