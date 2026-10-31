/**
 * @fileoverview Constants validation tests for AuraPlan AI.
 * Validates that budget share sum equals 1.0, contingency bounds are correct,
 * and preset key uniqueness is guaranteed.
 */

import { describe, it, expect } from 'vitest';
import {
  BUDGET_SHARES,
  CONTINGENCY_RESERVE_RATE,
  PRESET_MAP,
  PRESET_DISPLAY,
  BUDGET_CATEGORY_LABELS,
  GEMINI_MODEL_ID,
  SESSION_KEY_API,
  MAX_INPUT_LENGTH,
} from '../constants';

describe('Constants — Budget Share Coherence', () => {
  it('should have budget shares summing to exactly 1.0', () => {
    const sum = BUDGET_SHARES.reduce((acc, share) => acc + share, 0);
    expect(Math.abs(sum - 1.0)).toBeLessThan(0.001);
  });

  it('should have exactly 5 budget share pillars', () => {
    expect(BUDGET_SHARES).toHaveLength(5);
  });

  it('should have contingency reserve rate between 10% and 15%', () => {
    expect(CONTINGENCY_RESERVE_RATE).toBeGreaterThanOrEqual(0.10);
    expect(CONTINGENCY_RESERVE_RATE).toBeLessThanOrEqual(0.15);
  });

  it('should have contingency reserve set to exactly 0.12 (12%)', () => {
    expect(CONTINGENCY_RESERVE_RATE).toBe(0.12);
  });
});

describe('Constants — Preset Key Uniqueness', () => {
  it('should have unique preset keys in PRESET_MAP', () => {
    const keys = Object.keys(PRESET_MAP);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should have exactly 3 evaluator presets', () => {
    expect(Object.keys(PRESET_MAP)).toHaveLength(3);
    expect(PRESET_DISPLAY).toHaveLength(3);
  });

  it('should have all PRESET_DISPLAY keys present in PRESET_MAP', () => {
    PRESET_DISPLAY.forEach((preset) => {
      expect(PRESET_MAP).toHaveProperty(preset.key);
    });
  });
});

describe('Constants — Configuration Integrity', () => {
  it('should have GEMINI_MODEL_ID set to gemini-2.0-flash', () => {
    expect(GEMINI_MODEL_ID).toBe('gemini-2.0-flash');
  });

  it('should have SESSION_KEY_API defined as non-empty string', () => {
    expect(SESSION_KEY_API).toBeTruthy();
    expect(typeof SESSION_KEY_API).toBe('string');
  });

  it('should have MAX_INPUT_LENGTH set to a positive number', () => {
    expect(MAX_INPUT_LENGTH).toBeGreaterThan(0);
  });

  it('should have exactly 5 budget category labels', () => {
    expect(BUDGET_CATEGORY_LABELS).toHaveLength(5);
  });
});
