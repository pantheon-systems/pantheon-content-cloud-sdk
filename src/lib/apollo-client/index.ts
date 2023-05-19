/**
 * Re-exporting required Apollo modules to avoid
 * SyntaxError: Named export 'ApolloClient' not found. The requested module '@apollo/client' is
 * a CommonJS module, which may not support all module.exports as named exports.
 * Issue tracking: https://github.com/vercel/next.js/issues/39375
 */

import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache.js';
import { ApolloClient } from '@apollo/client/core/ApolloClient.js';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider.js';
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import gql from 'graphql-tag';

export { useQuery, gql, InMemoryCache, ApolloClient, ApolloProvider };
