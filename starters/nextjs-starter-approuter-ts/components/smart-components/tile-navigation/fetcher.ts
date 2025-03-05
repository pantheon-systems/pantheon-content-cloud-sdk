export interface ArticleTileData {
  id: string;
  image: string | null;
  title: string;
  url: string;
}


interface FetcherResponse {
  data: ArticleTileData[];
}

// Fetcher function for SWR
export const fetcher = async (url: string, ids: string[]): Promise<FetcherResponse> => {
  // Add the document IDs to the URL as query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("documentIds", ids.join(","));
  const urlWithParams = `${url}?${queryParams.toString()}`;

  const response = await fetch(urlWithParams, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch article data");
  }

  return response.json() as Promise<FetcherResponse>;
};