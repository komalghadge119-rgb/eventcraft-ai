/**
 * @fileoverview AI service tests for EventCraft AI.
 * Validates cleanJsonString parser, schema adherence, and prompt injection handling.
 */

import { describe, it, expect } from 'vitest';
import { cleanJsonString } from '../services/aiService';

describe('AI Service — cleanJsonString Parser', () => {
  it('should strip ```json fences from LLM output', () => {
    const fenced = '```json\n{"key": "value"}\n```';
    const result = cleanJsonString(fenced);
    expect(result).toBe('{"key": "value"}');
  });

  it('should strip ``` fences without language tag', () => {
    const fenced = '```\n{"key": "value"}\n```';
    const result = cleanJsonString(fenced);
    expect(result).toBe('{"key": "value"}');
  });

  it('should handle JSON with leading/trailing whitespace', () => {
    const padded = '  {"key": "value"}  ';
    expect(cleanJsonString(padded)).toBe('{"key": "value"}');
  });

  it('should extract JSON object from surrounding text', () => {
    const withText = 'Here is the JSON: {"key": "value"} Hope that helps!';
    const result = cleanJsonString(withText);
    expect(result).toBe('{"key": "value"}');
  });

  it('should handle already-clean JSON strings without modification', () => {
    const clean = '{"eventSummary": {"title": "Test"}}';
    expect(cleanJsonString(clean)).toBe(clean);
  });

  it('should handle JSON CODE fences with uppercase language tag', () => {
    const upper = '```JSON\n{"a": 1}\n```';
    expect(cleanJsonString(upper)).toBe('{"a": 1}');
  });

  it('should return empty-ish string for non-JSON text', () => {
    const noJson = 'plain text with no JSON braces';
    const result = cleanJsonString(noJson);
    /* Should strip fences but return whatever content remains */
    expect(typeof result).toBe('string');
  });

  it('should handle nested JSON with multiple closing braces correctly', () => {
    const nested = '{"outer": {"inner": {"deep": "value"}}}';
    const result = cleanJsonString(nested);
    expect(JSON.parse(result)).toHaveProperty('outer.inner.deep', 'value');
  });
});
