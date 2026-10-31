/**
 * @fileoverview Risk SENTINEL FMEA tests for AuraPlan AI.
 * Validates risk structure, probability/impact schemas, and Plan B trigger conditions.
 */

import { describe, it, expect } from 'vitest';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';

const VALID_PROBABILITIES = ['Low', 'Med', 'High'];
const VALID_IMPACTS = ['Low', 'Med', 'High', 'Critical'];

describe('Risk Sentinel — FMEA Structure', () => {
  it('should generate at least 5 risk entries', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    expect(plan.riskContingencyMatrix.length).toBeGreaterThanOrEqual(5);
  });

  it('should have valid probability values (Low|Med|High) on all risks', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    plan.riskContingencyMatrix.forEach((risk) => {
      expect(VALID_PROBABILITIES).toContain(risk.probability);
    });
  });

  it('should have valid impact values (Low|Med|High|Critical) on all risks', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    plan.riskContingencyMatrix.forEach((risk) => {
      expect(VALID_IMPACTS).toContain(risk.impact);
    });
  });
});

describe('Risk Sentinel — Plan B & Trigger Conditions', () => {
  it('should have non-empty contingency plans on all risks', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    plan.riskContingencyMatrix.forEach((risk) => {
      expect(risk.contingencyPlan.trim().length).toBeGreaterThan(10);
    });
  });

  it('should have non-empty trigger conditions on all risks', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    plan.riskContingencyMatrix.forEach((risk) => {
      expect(risk.triggerCondition.trim().length).toBeGreaterThan(10);
    });
  });

  it('should have unique risk descriptions (no duplicate risks)', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const riskSet = new Set(plan.riskContingencyMatrix.map((r) => r.risk));
    expect(riskSet.size).toBe(plan.riskContingencyMatrix.length);
  });
});
