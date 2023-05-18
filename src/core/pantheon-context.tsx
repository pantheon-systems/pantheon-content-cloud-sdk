import { ApolloProvider } from '@apollo/client';
import React, { PropsWithChildren } from 'react';

import { PantheonClient } from './pantheon-client';

interface PantheonProviderProps extends PropsWithChildren<any> {
  client: PantheonClient;
}

const PantheonContext = React.createContext<PantheonClient | null>(null);

export const PantheonProvider = ({
  client,
  children,
}: PantheonProviderProps) => (
  <PantheonContext.Provider value={client}>
    <ApolloProvider client={client.apolloClient}>{children}</ApolloProvider>
  </PantheonContext.Provider>
);

export const usePantheonClient = () => {
  const client = React.useContext(PantheonContext);

  if (!client) {
    throw new Error('Cannot use outside of a PantheonProvider');
  }

  return client;
};
