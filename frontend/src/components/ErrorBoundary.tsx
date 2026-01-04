import React from 'react';
import toast from 'react-hot-toast';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: {
    componentStack: string;
  } | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches errors in the component tree and displays a fallback UI
 * Prevents the entire app from crashing
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    // Log error details to console for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component Stack:', errorInfo.componentStack);

    // Update state with error info
    this.setState({ errorInfo });

    // Send error to monitoring service (optional)
    this.reportError(error, errorInfo);

    // Show user-friendly toast
    toast.error('Something went wrong. Please try refreshing the page.');
  }

  reportError = (error: Error, errorInfo: { componentStack: string }) => {
    // In production, you'd send this to an error tracking service like Sentry or LogRocket
    if (import.meta.env.MODE === 'production') {
      try {
        fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // Silently fail - don't break the app
        });
      } catch (e) {
        // Ignore
      }
    }
  };

  handleReload = () => {
    window.location.href = '/';
  };

  handleRefresh = () => {
    window.location.reload();
  };

  generateErrorId = (): string => {
    // Generate a unique error ID for tracking
    return `ERR_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            {/* Error Card */}
            <div className="bg-gray-900 border border-red-500 rounded-lg p-8 shadow-2xl">
              {/* Error Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                  <span className="text-4xl">⚠️</span>
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                Oops! Something went wrong
              </h1>

              <p className="text-gray-400 text-center mb-6">
                An unexpected error occurred while rendering the page. Our team has been notified.
              </p>

              {/* Error Details (Dev Mode Only) */}
              {import.meta.env.MODE === 'development' && this.state.error && (
                <div className="bg-black rounded p-4 mb-6 border border-red-500/20 max-h-60 overflow-y-auto">
                  <p className="text-red-400 text-xs font-mono mb-2">Error Details:</p>
                  <p className="text-gray-400 text-xs font-mono break-words">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-3">
                      <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
                        Stack Trace
                      </summary>
                      <pre className="text-gray-500 text-xs mt-2 overflow-auto max-h-40 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Go Home
                </button>
                <button
                  onClick={this.handleRefresh}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                >
                  Refresh
                </button>
              </div>

              {/* Support Message */}
              <p className="text-gray-500 text-xs text-center mt-6">
                If the problem persists, please contact support@js2move.com
              </p>
            </div>

            {/* Status Indicator */}
            <div className="mt-8 text-center text-gray-500 text-xs space-y-1">
              <p>Error ID: <span className="font-mono">{this.generateErrorId()}</span></p>
              <p>Report this ID if contacting support</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
