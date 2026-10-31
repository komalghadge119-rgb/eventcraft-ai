/**
 * @fileoverview Enterprise Error Boundary component for EventCraft AI.
 * Catches React rendering anomalies with a failover UI.
 * Zero raw stack trace disclosure in the DOM for security compliance.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { logger } from '../utils/logger';

/**
 * Props interface for the ErrorBoundary component.
 * @property {ReactNode} children - Child components to wrap with error protection.
 */
interface ErrorBoundaryProps {
  children: ReactNode;
}

/**
 * State interface for the ErrorBoundary component.
 * @property {boolean} hasError - Whether an error has been caught.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Enterprise-grade React Error Boundary component.
 * Catches rendering errors in child component trees and displays a
 * graceful failover UI without exposing internal stack traces or error details.
 * @extends Component<ErrorBoundaryProps, ErrorBoundaryState>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  /**
   * Derives error state from caught errors during rendering.
   * @returns {ErrorBoundaryState} Updated state with hasError flag set.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Logs the caught error using the structured logger.
   * Error details are logged to the console for developer debugging
   * but are NEVER exposed in the rendered DOM output.
   * @param {Error} error - The caught error object.
   * @param {React.ErrorInfo} errorInfo - React component stack trace information.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught rendering anomaly', {
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  /**
   * Handles session re-initialization by resetting the error state.
   * Allows the user to retry rendering the failed component tree.
   */
  handleReset = (): void => {
    this.setState({ hasError: false });
  };

  /**
   * Renders child components or the failover UI if an error was caught.
   * @returns {ReactNode} The rendered component tree or error fallback UI.
   */
  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container" role="alert" aria-live="assertive">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">⚠️</div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              EventCraft encountered an unexpected rendering issue.
              Your data is safe. Click below to re-initialize the session.
            </p>
            <button
              className="error-boundary-button"
              onClick={this.handleReset}
              type="button"
              aria-label="Re-initialize the application session"
            >
              Re-initialize Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
