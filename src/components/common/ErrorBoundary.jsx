import React from "react";

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree and displays
 * a fallback UI instead of crashing the entire application.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging (replace with error tracking service in production)
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-surface-container-low p-6">
          <div className="max-w-md w-full bg-surface p-8 rounded-3xl shadow-elevation-3 text-center border border-outline-variant/20">
            <span className="text-6xl mb-4 block">😵</span>
            <h1 className="text-2xl font-display font-bold text-error mb-2">
              Oops! Something went wrong.
            </h1>
            <p className="text-on-surface-variant mb-6">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            <div className="bg-surface-variant/30 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40">
              <code className="text-xs font-mono text-error">
                {this.state.error && this.state.error.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-dark transition-all shadow-md active:scale-95"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
