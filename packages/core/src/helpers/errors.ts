import { ApolloError } from "..";

export function handleApolloError(e: Error | unknown): never {
  if (e instanceof ApolloError) {
    const compactErrorInfo = {
      graphQLErrors: e.graphQLErrors,
      protocolErrors: e.protocolErrors,
      clientErrors: e.clientErrors,
      networkError: e.networkError,
      message: e.message,
    };

    console.error(
      "Apollo error occurred",
      JSON.stringify(compactErrorInfo, null, 4),
    );

    throw new Error(
      "Failed to retrieve PCC content due to " +
        JSON.stringify(compactErrorInfo, null, 4),
    );
  } else {
    console.error(e);
    throw e;
  }
}
