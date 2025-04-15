import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 max-w-lg w-full">
            <h2 className="text-red-500 font-semibold mb-2">Something went wrong</h2>
            <p className="text-zinc-300 text-sm mb-4">
              An error occurred while rendering this component. Please try refreshing the page.
            </p>
            <pre className="text-xs text-red-400 bg-black/30 p-2 rounded overflow-x-auto">
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
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