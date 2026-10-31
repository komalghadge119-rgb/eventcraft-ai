/**
 * @fileoverview Input sanitizer tests for AuraPlan AI.
 * Validates HTML tag stripping, entity encoding, length caps,
 * and prototype-pollution rejection across all sanitizer functions.
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  stripHtmlTags,
  encodeEntities,
  truncateInput,
  containsPollutionAttack,
  deepSanitize,
} from '../utils/sanitizer';

describe('Sanitizer — containsPollutionAttack', () => {
  it('should detect __proto__ attack vector', () => {
    expect(containsPollutionAttack('test __proto__ injection')).toBe(true);
  });

  it('should detect constructor attack vector', () => {
    expect(containsPollutionAttack('constructor.prototype.evil')).toBe(true);
  });

  it('should detect prototype attack vector', () => {
    expect(containsPollutionAttack('Object.prototype.polluted')).toBe(true);
  });

  it('should pass clean input through safely', () => {
    expect(containsPollutionAttack('hello world')).toBe(false);
  });
});

describe('Sanitizer — stripHtmlTags', () => {
  it('should replace < with &lt;', () => {
    expect(stripHtmlTags('<script>')).toContain('&lt;');
  });

  it('should replace > with &gt;', () => {
    expect(stripHtmlTags('<div>')).toContain('&gt;');
  });

  it('should not modify clean text', () => {
    expect(stripHtmlTags('Hello World')).toBe('Hello World');
  });
});

describe('Sanitizer — encodeEntities', () => {
  it('should encode ampersands', () => {
    expect(encodeEntities('a & b')).toContain('&amp;');
  });

  it('should encode double quotes', () => {
    expect(encodeEntities('"quoted"')).toContain('&quot;');
  });

  it('should encode single quotes', () => {
    expect(encodeEntities("it's")).toContain('&#x27;');
  });

  it('should encode backticks', () => {
    expect(encodeEntities('`template`')).toContain('&#96;');
  });

  it('should encode angle brackets', () => {
    const result = encodeEntities('<b>text</b>');
    expect(result).toContain('&lt;');
    expect(result).toContain('&gt;');
  });
});

describe('Sanitizer — truncateInput', () => {
  it('should truncate strings exceeding maxLength', () => {
    const long = 'a'.repeat(200);
    const result = truncateInput(long, 100);
    expect(result.length).toBeLessThanOrEqual(101); /* +1 for ellipsis char */
  });

  it('should append ellipsis when truncating', () => {
    const long = 'a'.repeat(200);
    const result = truncateInput(long, 100);
    expect(result).toMatch(/…$/);
  });

  it('should not truncate strings within limit', () => {
    const short = 'hello world';
    expect(truncateInput(short, 100)).toBe(short);
  });
});

describe('Sanitizer — sanitizeInput (full pipeline)', () => {
  it('should return empty string for prototype-pollution input', () => {
    expect(sanitizeInput('__proto__.evil')).toBe('');
  });

  it('should return empty string for empty/whitespace-only input', () => {
    expect(sanitizeInput('   ')).toBe('');
  });

  it('should return empty string for non-string input', () => {
    expect(sanitizeInput(null as unknown as string)).toBe('');
    expect(sanitizeInput(undefined as unknown as string)).toBe('');
  });

  it('should encode entities in valid input', () => {
    const result = sanitizeInput('<b>Event</b>');
    expect(result).toContain('&lt;');
    expect(result).not.toContain('<b>');
  });

  it('should respect custom maxLength parameter', () => {
    const input = 'a'.repeat(100);
    const result = sanitizeInput(input, 50);
    expect(result.length).toBeLessThanOrEqual(51);
  });
});

describe('Sanitizer — deepSanitize', () => {
  it('should sanitize nested string values in an object', () => {
    const obj = { name: '<b>evil</b>', nested: { title: '"quoted"' } };
    const result = deepSanitize(obj) as Record<string, unknown>;
    expect((result.name as string)).not.toContain('<b>');
    expect((result.nested as Record<string, unknown>).title as string).toContain('&quot;');
  });

  it('should sanitize strings in arrays', () => {
    const arr = ['<script>', 'safe', '"quote"'];
    const result = deepSanitize(arr) as string[];
    expect(result[0]).not.toContain('<script>');
  });

  it('should pass through numbers and booleans unchanged', () => {
    const obj = { count: 42, active: true };
    const result = deepSanitize(obj) as Record<string, unknown>;
    expect(result.count).toBe(42);
    expect(result.active).toBe(true);
  });
});
