import React, { Component, Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends Component<
  Props,
  {
    hasError: boolean;
  }
> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>Something went wrong while rendering this smart component.</div>
      );
    }

    return this.props.children;
  }
}

const SuspenseErrorBoundary = ({ children }: Props) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading smart component...</div>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export const withSmartComponentErrorBoundary = (
  Component: React.ComponentType<unknown>,
) => {
  const WithSmartComponentErrorBoundary = (props: Record<string, unknown>) => (
    <SuspenseErrorBoundary>
      <Component {...props} />
    </SuspenseErrorBoundary>
  );

  WithSmartComponentErrorBoundary.displayName = `WithSmartComponentErrorBoundary(${getDisplayName(
    Component,
  )})`;

  return WithSmartComponentErrorBoundary;
};

function getDisplayName(Component: React.ComponentType<unknown>) {
  return Component.displayName || Component.name || "Component";
}
