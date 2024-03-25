import { ApolloError } from "@apollo/client";

export function handleApolloError(e: Error | unknown): never {
  if (e instanceof ApolloError) {
    console.error(
      e,
      e.name,
      e.graphQLErrors,
      e.protocolErrors,
      e.clientErrors,
      e.networkError,
      "message",
      e.message,
      "endmessage",
      Object.keys(e.extraInfo || {}),
    );

    const compactErrorInfo = {
      graphQLErrors: e.graphQLErrors,
      protocolErrors: e.protocolErrors,
      clientErrors: e.clientErrors,
      networkError: e.networkError,
      message: e.message,
    };

    throw new Error(
      "Failed to retrieve PCC content due to " +
        JSON.stringify(compactErrorInfo, null, 4),
    );
  } else {
    console.error(e);
    throw e;
  }
}
