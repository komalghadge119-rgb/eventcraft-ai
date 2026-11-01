/**
 * @fileoverview Component tests for ErrorBoundary.
 * Verifies rendering fallback failover and error suppression.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

const ThrowErrorComponent = () => {
  throw new Error('Test rendering anomaly');
};

describe('ErrorBoundary Component', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText('Safe Content')).toBeTruthy();
  });

  it('renders failover UI when a child component throws', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowErrorComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText(/EventCraft encountered an unexpected rendering issue/i)).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });
});
