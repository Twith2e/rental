"use client";

import React from "react";

interface NavigationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Error boundary specifically for navigation-related errors
 * Prevents navigation.usePathname errors from crashing the app
 */
export class NavigationErrorBoundary extends React.Component<
  NavigationErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: NavigationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's a navigation-related error
    if (error.message.includes('navigation.usePathname')) {
      return { hasError: true };
    }
    return null;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <p>Navigation temporarily unavailable. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}