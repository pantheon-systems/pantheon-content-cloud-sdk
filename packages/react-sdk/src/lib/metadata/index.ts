/**
 * Static helper functions for site-wide metadata.
 */

import { PantheonClient } from "../../core/pantheon-client";
import { gql } from "../apollo-client";

export const LIST_TAGS_QUERY = gql`
  query ListTags($id: String!) {
    site(id: $id) {
      tags
    }
  }
`;

export async function getAllTags(client: PantheonClient): Promise<string[]> {
  const { site } = (
    await client.apolloClient.query({
      query: LIST_TAGS_QUERY,
      variables: { id: client.siteId },
    })
  ).data;

  return site.tags || [];
}
