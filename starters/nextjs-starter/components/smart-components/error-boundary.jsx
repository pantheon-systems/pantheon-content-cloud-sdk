import React, { Component, Suspense } from "react";

export class SmartComponentErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
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

const SmartComponentSuspenseErrorBoundary = ({ children }) => {
  return (
    <SmartComponentErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </SmartComponentErrorBoundary>
  );
};

export const withSmartComponentErrorBoundary =
  // eslint-disable-next-line react/display-name
  (Component) => (props) => (
    <SmartComponentSuspenseErrorBoundary>
      <Component {...props} />
    </SmartComponentSuspenseErrorBoundary>
  );

export default SmartComponentErrorBoundary;