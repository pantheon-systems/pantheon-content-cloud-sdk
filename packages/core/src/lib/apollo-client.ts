/**
 * Re-exporting required Apollo modules to avoid
 * SyntaxError: Named export 'ApolloClient' not found. The requested module '@apollo/client' is
 * a CommonJS module, which may not support all module.exports as named exports.
 *
 * ESM requires that internal package imports are absolutely resolved;
 * Tracking issue: https://github.com/microsoft/TypeScript/issues/16577
 */

export { ApolloClient } from "@apollo/client/core/ApolloClient.js";
export { ApolloError } from "@apollo/client/errors/index.js";
export { GraphQLWsLink } from "@apollo/client/link/subscriptions/index.js";
export { HttpLink } from "@apollo/client/link/http/index.js";
export { split, ApolloLink } from "@apollo/client/link/core/index.js";
export { default as gql } from "graphql-tag";
export { InMemoryCache } from "@apollo/client/cache/inmemory/inMemoryCache.js";
export { getMainDefinition } from "@apollo/client/utilities/index.js";
