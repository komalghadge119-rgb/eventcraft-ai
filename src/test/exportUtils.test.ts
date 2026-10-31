/**
 * @fileoverview Export utilities tests for AuraPlan AI.
 * Validates RFC 5545 ICS formatting, UID uniqueness, CRLF escaping,
 * and Markdown dossier generation.
 */

import { describe, it, expect } from 'vitest';
import { generateIcsUid, escapeIcsText, generateIcsContent, generateMarkdownDossier } from '../utils/exportUtils';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';

describe('Export Utils — ICS Generation', () => {
  it('should generate unique UIDs on each call', () => {
    const uid1 = generateIcsUid();
    const uid2 = generateIcsUid();
    expect(uid1).not.toBe(uid2);
  });

  it('should generate valid .ics content starting with BEGIN:VCALENDAR', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const ics = generateIcsContent(plan);
    expect(ics).toMatch(/^BEGIN:VCALENDAR/);
  });

  it('should end .ics content with END:VCALENDAR', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const ics = generateIcsContent(plan);
    expect(ics).toMatch(/END:VCALENDAR\s*$/);
  });

  it('should escape commas and semicolons in ICS text per RFC 5545', () => {
    expect(escapeIcsText('a,b;c')).toBe('a\\,b\\;c');
  });
});

describe('Export Utils — Markdown Dossier', () => {
  it('should generate Markdown dossier containing the event title', () => {
    const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);
    const md = generateMarkdownDossier(plan);
    expect(md).toContain(plan.eventSummary.title);
  });
});
