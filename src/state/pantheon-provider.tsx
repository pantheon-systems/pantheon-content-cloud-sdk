import React, { PropsWithChildren } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_GQL_ENDPOINT}/query`,
  cache: new InMemoryCache(),
});

export const PantheonProvider = ({ children }: PropsWithChildren<any>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);
