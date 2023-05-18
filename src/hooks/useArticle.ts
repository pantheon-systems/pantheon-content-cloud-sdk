import { gql, useQuery } from '@apollo/client';
import { useEffect, useRef } from 'react';

const GET_ARTICLE_QUERY = gql`
  query GetArticle($id: String!) {
    article(id: $id) {
      id
      title
      content
      source
      sourceURL
      keywords
      publishedDate
    }
  }
`;

export const useArticle = (id: string) => {
  const socketRef = useRef<WebSocket>();
  const idRef = useRef<string>();

  const queryData = useQuery(GET_ARTICLE_QUERY, {
    variables: { id },
  });

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  // TODO: JUST FOR DEMO PURPOSES, BECAUSE FIREBASE SNAPSHOT SUDDENLY STOPPED WORKING.
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryData.refetch();
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  // Don't connect to websocket during SSR.
  useEffect(() => {
    if (typeof window === 'undefined' || socketRef.current != null) return;

    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT}/ws`
    );
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      console.log('We have connected to the GraphQL backend.');

      if (id != null) {
        console.log(
          'We have asked the GraphQL backend to notify us whenever the article content changes.'
        );
        socket.send(
          JSON.stringify({
            Command: 'subchanges',
            Id: id,
          })
        );
      }
    });

    socket.addEventListener('close', () => {
      console.log('%cDisconnected and lonely', 'color: red;');
    });

    socket.addEventListener('message', (e) => {
      const json = JSON.parse(e.data);

      switch (json.Command) {
        case 'refetch':
          if (json.Id === idRef.current) {
            console.log(
              '%cGraphQL server has told us new content is available - refetching...',
              'color: yellow;'
            );
            queryData.refetch();
          }
          break;
        case 'doc_gone':
          if (json.Id === idRef.current) {
            // TODO: Handle case when doc we are watching has been deleted.
            console.error('Doc is gone');
          }
          break;
        case 'debug':
          console.info({ json });
          break;
        default:
          console.error(`Unrecognized command ${json.Command}`, json);
      }
    });
  }, []);

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN)
      socketRef.current.send(
        JSON.stringify({
          Command: 'subchanges',
          Id: id,
        })
      );
  }, [id]);

  useEffect(() => {
    console.log('%cSuccessfully fetched updated content', 'color: lime;');
  }, [queryData.data]);

  return queryData;
};
