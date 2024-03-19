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
    // Replace this with your own error logging solution
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
  // This effectively opts your smart components out of server-side rendering.
  // This is a trade-off you should consider. If you want to opt-in to
  // server-side rendering of the component, disable this error boundary but be
  // aware errors in the component will crash the entire page.
  <SuspenseErrorBoundary>
    <Component {...props} />
  </SuspenseErrorBoundary>
);
