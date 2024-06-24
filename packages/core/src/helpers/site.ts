import { PantheonClient } from "../core/pantheon-client";
import { GET_SITE_QUERY } from "../lib/gql";
import { Site } from "../types";

export async function getSite(client: PantheonClient, id: string) {
  const site = await client.apolloClient.query({
    query: GET_SITE_QUERY,
    variables: {
      id,
    },
  });

  return site.data.site as Site;
}
