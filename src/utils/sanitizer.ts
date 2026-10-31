/**
 * @fileoverview Security-focused input sanitizer for EventCraft AI.
 * Provides XSS protection, entity encoding, length truncation, and
 * prototype-pollution guard functions for all user-facing input fields.
 */

import { MAX_INPUT_LENGTH } from '../constants';

/**
 * Prototype-pollution attack keywords that must be rejected from all input.
 * These strings are commonly used in JavaScript prototype pollution exploits.
 * @constant {readonly string[]}
 */
const POLLUTION_KEYWORDS: readonly string[] = [
  '__proto__',
  'constructor',
  'prototype',
] as const;

/**
 * Checks whether a string contains prototype-pollution attack vectors.
 * @param {string} input - The raw input string to check.
 * @returns {boolean} True if the string contains dangerous pollution keywords.
 */
export function containsPollutionAttack(input: string): boolean {
  const lower = input.toLowerCase();
  return POLLUTION_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/**
 * Strips HTML angle brackets from a string to prevent XSS injection.
 * Replaces `<` and `>` with their HTML entity equivalents.
 * @param {string} input - The raw input string to strip.
 * @returns {string} The sanitized string with angle brackets replaced by entities.
 */
export function stripHtmlTags(input: string): string {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Encodes special HTML characters to their entity equivalents.
 * Handles ampersands, quotes, and backticks in addition to angle brackets.
 * @param {string} input - The raw input string to encode.
 * @returns {string} The entity-encoded string safe for HTML rendering.
 */
export function encodeEntities(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/`/g, '&#96;');
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 * @param {string} input - The input string to truncate.
 * @param {number} [maxLength] - Maximum allowed character count. Defaults to MAX_INPUT_LENGTH.
 * @returns {string} The truncated string with trailing ellipsis if it exceeded the limit.
 */
export function truncateInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength) + '…';
}

/**
 * Comprehensive input sanitizer pipeline that applies all security transformations.
 * Processing order: pollution check → entity encoding → length truncation.
 * @param {string} input - The raw untrusted input string to sanitize.
 * @param {number} [maxLength] - Optional maximum character length override.
 * @returns {string} The fully sanitized string, or an empty string if pollution is detected.
 * @throws Never throws — returns empty string on dangerous input.
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (typeof input !== 'string') return '';
  if (input.trim().length === 0) return '';
  if (containsPollutionAttack(input)) return '';

  const encoded = encodeEntities(input);
  return truncateInput(encoded, maxLength);
}

/**
 * Deep sanitizes all string values within a nested object structure.
 * Recursively traverses objects and arrays, sanitizing every string leaf.
 * Non-string primitives (numbers, booleans, null) are passed through unchanged.
 * @param {unknown} obj - The untrusted object to deep sanitize.
 * @returns {unknown} A new object with all string values sanitized.
 */
export function deepSanitize(obj: unknown): unknown {
  if (typeof obj === 'string') return sanitizeInput(obj);
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(deepSanitize);

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (containsPollutionAttack(key)) continue;
    result[key] = deepSanitize(value);
  }
  return result;
}
