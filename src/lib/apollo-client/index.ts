/**
 * Re-exporting required Apollo modules to avoid
 * SyntaxError: Named export 'ApolloClient' not found. The requested module '@apollo/client' is
 * a CommonJS module, which may not support all module.exports as named exports.
 *
 * ESM requires that internal package imports are absolutely resolved;
 * Tracking issue: https://github.com/microsoft/TypeScript/issues/16577
 */

import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache.js';
import { ApolloClient } from '@apollo/client/core/ApolloClient.js';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider.js';
import { useQuery } from '@apollo/client/react/hooks/useQuery.js';
import gql from 'graphql-tag'; // Just for convenience

export { useQuery, gql, InMemoryCache, ApolloClient, ApolloProvider };
