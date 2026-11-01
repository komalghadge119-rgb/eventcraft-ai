/**
 * @fileoverview Complete export utilities test covering ICS download, Markdown download, and print triggers.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadIcsFile, downloadMarkdownDossier, triggerPdfPrint, escapeIcsText } from '../utils/exportUtils';
import { synthesizeFallbackPlan } from '../services/fallbackSynthesizer';
import { PRESET_ROYAL_WEDDING } from '../constants';

describe('Export Utils Full Suite', () => {
  const plan = synthesizeFallbackPlan(PRESET_ROYAL_WEDDING);

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('properly escapes CRLF sequences and special iCalendar characters', () => {
    const raw = 'Special, text; with \\ and\r\nnewlines\nand\rcarriage';
    const escaped = escapeIcsText(raw);
    expect(escaped).not.toContain('\r');
    expect(escaped).toContain('\\,');
    expect(escaped).toContain('\\;');
  });

  it('triggers browser print window', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    triggerPdfPrint();
    expect(printSpy).toHaveBeenCalled();
  });

  it('generates a downloadable ICS blob and clicks anchor', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-ics-url');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
      if (tagName === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    downloadIcsFile(plan);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-ics-url');
    createElementSpy.mockRestore();
  });

  it('generates a downloadable Markdown dossier blob and clicks anchor', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-md-url');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const clickSpy = vi.fn();
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
      if (tagName === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    downloadMarkdownDossier(plan);

    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-md-url');
    createElementSpy.mockRestore();
  });
});
