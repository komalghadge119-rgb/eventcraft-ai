/**
 * @fileoverview Logger utility tests for AuraPlan AI.
 * Validates method delegations (debug/info/warn/error), prefix formatting,
 * and Vitest silent-mode suppression.
 */

import { describe, it, expect, vi } from 'vitest';
import { logger } from '../utils/logger';
import { LOGGER_PREFIX } from '../constants';

describe('Logger — Vitest Suppression Mode', () => {
  it('should suppress console.debug during Vitest execution (VITEST=true)', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('test debug message');
    /* In Vitest environment, logger is silenced, so spy should NOT have been called */
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should suppress console.info during Vitest execution', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    logger.info('test info message');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should suppress console.warn during Vitest execution', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('test warn message');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should suppress console.error during Vitest execution', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('test error message');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('Logger — Structure & API Surface', () => {
  it('should expose debug, info, warn, and error methods', () => {
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should have LOGGER_PREFIX set to [EventCraft]', () => {
    expect(LOGGER_PREFIX).toBe('[EventCraft]');
  });
});
