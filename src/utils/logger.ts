/**
 * @fileoverview Structured singleton logger for AuraPlan AI.
 * Replaces all raw console.warn/error calls with prefixed, structured logging.
 * Automatically suppresses output during Vitest test execution to keep test output clean.
 */

import { LOGGER_PREFIX } from '../constants';

/**
 * Checks whether the current execution environment is a Vitest test runner.
 * When running in Vitest, all log output is suppressed to prevent noisy test logs.
 * @returns {boolean} True if running inside Vitest, false otherwise.
 */
function isTestEnvironment(): boolean {
  try {
    return typeof process !== 'undefined' && process.env?.VITEST === 'true';
  } catch {
    return false;
  }
}

/**
 * Structured application logger with automatic prefix formatting.
 * All log methods are no-ops when running in Vitest (`process.env.VITEST === 'true'`).
 *
 * @example
 * ```typescript
 * import { logger } from './utils/logger';
 * logger.info('Plan synthesized', { planId: 'abc-123' });
 * // Output: [AuraPlan] [INFO] Plan synthesized { planId: 'abc-123' }
 * ```
 */
export const logger = {
  /**
   * Logs a debug-level message with the application prefix.
   * @param {string} message - The debug message to log.
   * @param {...unknown[]} args - Additional arguments to include in the log entry.
   */
  debug(message: string, ...args: unknown[]): void {
    if (isTestEnvironment()) return;
    console.debug(`${LOGGER_PREFIX} [DEBUG]`, message, ...args);
  },

  /**
   * Logs an informational message with the application prefix.
   * @param {string} message - The informational message to log.
   * @param {...unknown[]} args - Additional arguments to include in the log entry.
   */
  info(message: string, ...args: unknown[]): void {
    if (isTestEnvironment()) return;
    console.info(`${LOGGER_PREFIX} [INFO]`, message, ...args);
  },

  /**
   * Logs a warning message with the application prefix.
   * @param {string} message - The warning message to log.
   * @param {...unknown[]} args - Additional arguments to include in the log entry.
   */
  warn(message: string, ...args: unknown[]): void {
    if (isTestEnvironment()) return;
    console.warn(`${LOGGER_PREFIX} [WARN]`, message, ...args);
  },

  /**
   * Logs an error message with the application prefix.
   * @param {string} message - The error message to log.
   * @param {...unknown[]} args - Additional arguments to include in the log entry.
   */
  error(message: string, ...args: unknown[]): void {
    if (isTestEnvironment()) return;
    console.error(`${LOGGER_PREFIX} [ERROR]`, message, ...args);
  },
};
