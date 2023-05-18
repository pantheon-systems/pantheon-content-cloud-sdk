import React, { PropsWithChildren } from 'react';
import { ApolloProvider } from '@apollo/client';

import { PantheonClient } from './pantheon-client';

interface PantheonProviderProps extends PropsWithChildren<any> {
  client: PantheonClient;
}

export const PantheonProvider = ({
  client,
  children,
}: PantheonProviderProps) => (
  <ApolloProvider client={client.apolloClient}>{children}</ApolloProvider>
);

const PantheonContext = React.createContext<PantheonProviderProps | null>(null);

export const usePantheonClient = () => {
  const context = React.useContext(PantheonContext);
  if (!context) {
    throw new Error('Cannot use outside of a PantheonProvider');
  }
  return context.client;
};
