"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-200 rounded-md bg-red-50">
          <h3 className="text-sm font-medium text-red-800">Something went wrong</h3>
          <p className="text-sm text-red-600 mt-1">
            An error occurred while rendering this component.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-2">
              <summary className="text-xs text-red-500 cursor-pointer">Error details</summary>
              <pre className="text-xs text-red-400 mt-1 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
