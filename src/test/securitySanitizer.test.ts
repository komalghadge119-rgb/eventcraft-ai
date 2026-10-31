/**
 * @fileoverview Security sanitizer deep-object traversal tests for EventCraft AI.
 * Validates deep sanitization of nested objects with mixed types.
 */

import { describe, it, expect } from 'vitest';
import { deepSanitize } from '../utils/sanitizer';

describe('Security Sanitizer — Deep Object Traversal', () => {
  it('should sanitize deeply nested object structures', () => {
    const deep = {
      level1: {
        level2: {
          level3: '<script>alert("xss")</script>',
        },
      },
    };
    const result = deepSanitize(deep) as { level1: { level2: { level3: string } } };
    expect(result.level1.level2.level3).not.toContain('<script>');
    expect(result.level1.level2.level3).toContain('&lt;script&gt;');
  });

  it('should drop keys with prototype-pollution names in deep objects', () => {
    const raw = JSON.parse('{"safe": "hello", "constructor": "injected", "__proto__": "bad"}');
    const result = deepSanitize(raw) as Record<string, unknown>;
    expect(result.safe).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(false);
  });

  it('should handle null values without throwing', () => {
    const obj = { name: null, count: 0, active: false };
    const result = deepSanitize(obj) as Record<string, unknown>;
    expect(result.name).toBeNull();
    expect(result.count).toBe(0);
    expect(result.active).toBe(false);
  });
});
