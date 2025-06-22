// components/ErrorBoundary.tsx
'use client';

import React, { Component, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      'Client-side error caught by ErrorBoundary:',
      error,
      errorInfo
    );
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen uppercase text-white flex items-center justify-center text-center bg-flag-red p-4">
          <div>
            <h1 className="text-xl font-bold mb-4">Something went wrong.</h1>
            <p className="mb-4 text-xs">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 text-sm bg-flag-blue text-white uppercase hover:bg-blue-600 transition"
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
