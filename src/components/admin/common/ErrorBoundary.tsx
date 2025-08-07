'use client';

import React from 'react';
/* eslint-disable  @typescript-eslint/no-explicit-any */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // You can also send error reports here to your monitoring service
  }

  handleReload = () => {
    window.location.href = window.location.href;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50 text-red-900">
          <h1 className="text-xl font-bold mb-4">
            Oops! Something went wrong.
          </h1>
          <p className="mb-6 max-w-xl text-center whitespace-pre-wrap">
            {this.state.error?.message || 'Unknown error occurred.'}
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 uppercase bg-red-600 hover:bg-red-700 text-white rounded"
          >
            refresh app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
