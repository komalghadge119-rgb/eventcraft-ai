/**
 * @fileoverview Budget allocation section component for EventCraft AI.
 * Displays the 5-pillar financial matrix with progress bars,
 * variance tracking, and the 12% dynamic contingency reserve tile.
 */

import React, { useMemo } from 'react';
import { DollarSign, Shield, TrendingUp } from 'lucide-react';
import type { BudgetAllocation } from '../types/event';

/**
 * Props interface for the BudgetSection component.
 * @property {BudgetAllocation} budget - The budget allocation data from the QUANT agent.
 */
interface BudgetSectionProps {
  budget: BudgetAllocation;
}

/**
 * Formats a number as a currency string with locale-appropriate separators.
 * @param {number} amount - The monetary amount to format.
 * @param {string} currency - The ISO 4217 currency code.
 * @returns {string} The formatted currency string.
 */
function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

/**
 * Quant Financial Allocations Matrix displaying the 5-pillar budget breakdown.
 * Includes live progress bars, variance tracking (allocated vs actual spent),
 * and a dedicated contingency reserve highlight tile.
 * @param {BudgetSectionProps} props - The component props.
 * @returns {React.ReactElement} The rendered budget section.
 */
export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget }) => {
  const totalAllocated = useMemo(
    () => budget.categories.reduce((sum, c) => sum + c.allocated, 0),
    [budget.categories],
  );
  const totalSpent = useMemo(
    () => budget.categories.reduce((sum, c) => sum + (c.actualSpent || 0), 0),
    [budget.categories],
  );

  return (
    <section className="plan-section" aria-labelledby="budget-heading">
      <div className="section-header">
        <DollarSign className="section-icon" size={24} aria-hidden="true" />
        <div>
          <h2 className="section-title" id="budget-heading">Quant Financial Allocations</h2>
          <p className="section-subtitle">5-Pillar Budget Matrix with Dynamic Contingency Reserve</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="budget-summary-row">
        <div className="budget-summary-card">
          <span className="budget-summary-label">Total Budget</span>
          <span className="budget-summary-value">{formatCurrency(budget.total, budget.currency)}</span>
        </div>
        <div className="budget-summary-card">
          <span className="budget-summary-label">Allocated to Pillars</span>
          <span className="budget-summary-value">{formatCurrency(totalAllocated, budget.currency)}</span>
        </div>
        <div className="budget-summary-card">
          <span className="budget-summary-label">Tracked Expenditure</span>
          <span className="budget-summary-value budget-spent">{formatCurrency(totalSpent, budget.currency)}</span>
        </div>
      </div>

      {/* Contingency Reserve Tile */}
      <div className="contingency-tile" role="status" aria-label="Contingency reserve information">
        <Shield className="contingency-icon" size={20} aria-hidden="true" />
        <div className="contingency-info">
          <span className="contingency-label">12% Dynamic Contingency Reserve</span>
          <span className="contingency-value">{formatCurrency(budget.contingencyReserve, budget.currency)}</span>
        </div>
        <span className="contingency-note">Margin protection against overruns, vendor failures, and force majeure events.</span>
      </div>

      {/* 5-Pillar Category Matrix */}
      <div className="budget-categories">
        {budget.categories.map((cat) => {
          const progress = budget.total > 0 ? (cat.allocated / budget.total) * 100 : 0;
          const spentProgress = cat.allocated > 0 ? ((cat.actualSpent || 0) / cat.allocated) * 100 : 0;
          const isOverBudget = spentProgress > 100;

          return (
            <div key={cat.category} className="budget-card">
              <div className="budget-card-header">
                <span className="budget-card-category">{cat.category}</span>
                <span className="budget-card-percentage">{cat.percentage}%</span>
              </div>

              <div className="budget-card-amount">
                <span className="budget-allocated">{formatCurrency(cat.allocated, budget.currency)}</span>
                {(cat.actualSpent ?? 0) > 0 && (
                  <span className={`budget-spent-tag ${isOverBudget ? 'over-budget' : ''}`}>
                    <TrendingUp size={12} aria-hidden="true" />
                    {formatCurrency(cat.actualSpent || 0, budget.currency)} spent
                  </span>
                )}
              </div>

              {/* Allocation Progress Bar */}
              <div className="budget-progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat.category} budget allocation`}>
                <div className="budget-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                {spentProgress > 0 && (
                  <div className={`budget-spent-overlay ${isOverBudget ? 'over-budget-bar' : ''}`} style={{ width: `${Math.min(spentProgress * (progress / 100), 100)}%` }} />
                )}
              </div>

              <p className="budget-tip">{cat.tips}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
