import { gql, useQuery } from '@apollo/client';
import { useEffect, useRef } from 'react';

import { usePantheonClient } from '../core/pantheon-context';
import { Article } from '../types';

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
  const { wsHost, logger } = usePantheonClient();
  const queryData = useQuery<{ article: Article }>(GET_ARTICLE_QUERY, {
    variables: { id },
  });

  const socketRef = useRef<WebSocket>();
  const idRef = useRef<string>();

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  useEffect(() => {
    if (socketRef.current != null) return;

    const socket = new WebSocket(`${wsHost}/ws`);
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      logger.info('Connected to the GraphQL backend.');

      socket.send(
        JSON.stringify({
          Command: 'subchanges',
          Id: id,
        }),
      );
    });

    socket.addEventListener('close', () => {
      logger.info('%cDisconnected and lonely', 'color: red;');
    });

    socket.addEventListener('message', (e) => {
      const json = JSON.parse(e.data);

      switch (json.Command) {
        case 'refetch': {
          if (json.Id === idRef.current) {
            logger.info(
              '%cNew content is available - refetching...',
              'color: yellow;',
            );
            queryData.refetch();
          }
          break;
        }
        case 'doc_gone': {
          if (json.Id === idRef.current) {
            // TODO: Handle case when doc we are watching has been deleted.
            logger.error('Document has been deleted');
          }
          break;
        }
        case 'debug': {
          logger.info({ json });
          break;
        }
        default: {
          logger.error(`Unrecognized command ${json.Command}`, json);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          Command: 'subchanges',
          Id: id,
        }),
      );
    }
  }, [id]);

  useEffect(() => {
    logger.info('%cSuccessfully fetched updated content', 'color: lime;');
  }, [queryData.data]);

  return {
    ...queryData,
    article: queryData.data?.article,
  };
};
