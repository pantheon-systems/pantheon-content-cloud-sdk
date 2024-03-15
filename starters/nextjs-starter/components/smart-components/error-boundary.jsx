import React, { Component, Suspense } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="my-2 text-gray-400">
          Something went wrong while rendering this smart component.
        </div>
      );
    }

    return this.props.children;
  }
}

const SuspenseErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export const withSmartComponentErrorBoundary = (Component) => (props) => (
  <SuspenseErrorBoundary>
    <Component {...props} />
  </SuspenseErrorBoundary>
);
