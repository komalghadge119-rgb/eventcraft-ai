/**
 * @fileoverview Budget calculator tests for AuraPlan AI.
 * Validates 5-pillar allocation math, 12% contingency calculation,
 * and mathematical coherence invariants.
 */

import { describe, it, expect } from 'vitest';
import { computeBudgetAllocation } from '../services/fallbackSynthesizer';
import { BUDGET_SHARES, CONTINGENCY_RESERVE_RATE, BUDGET_CATEGORY_LABELS } from '../constants';

describe('Budget Calculator — 5-Pillar Allocation & Contingency', () => {
  it('should compute contingency reserve as exactly 12% of total budget', () => {
    const total = 1000000;
    const { contingencyReserve } = computeBudgetAllocation(total, 'INR');
    expect(contingencyReserve).toBe(Math.round(total * CONTINGENCY_RESERVE_RATE));
  });

  it('should allocate budget across exactly 5 pillars', () => {
    const { categories } = computeBudgetAllocation(500000, 'INR');
    expect(categories).toHaveLength(5);
  });

  it('should satisfy the coherence invariant: sum(pillars) + contingency ≈ total', () => {
    const total = 3500000;
    const { categories, contingencyReserve } = computeBudgetAllocation(total, 'INR');
    const pillarSum = categories.reduce((acc, c) => acc + c.allocated, 0);
    const reconstructed = pillarSum + contingencyReserve;
    /* Allow ±5 rounding tolerance */
    expect(Math.abs(reconstructed - total)).toBeLessThanOrEqual(5);
  });

  it('should apply correct percentage labels matching BUDGET_SHARES', () => {
    const { categories } = computeBudgetAllocation(1000000, 'INR');
    const expectedPercentages = BUDGET_SHARES.map((s) => Math.round(s * 100));
    categories.forEach((c, i) => {
      expect(c.percentage).toBe(expectedPercentages[i]);
    });
  });

  it('should assign correct category labels in display order', () => {
    const { categories } = computeBudgetAllocation(1000000, 'INR');
    categories.forEach((c, i) => {
      expect(c.category).toBe(BUDGET_CATEGORY_LABELS[i]);
    });
  });
});
