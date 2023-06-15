import { PropsWithChildren } from 'react';
import * as _apollo_client from '@apollo/client';
import { NormalizedCacheObject } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core/ApolloClient.js';
import * as _apollo_client_core_ApolloClient from '@apollo/client/core/ApolloClient';
import { A as ArticleWithoutContent, a as Article, C as ContentType, P as PublishingLevel } from './index-e9db137d.js';
export { a as Article, A as ArticleWithoutContent, C as ContentType, P as PublishingLevel } from './index-e9db137d.js';

interface Logger {
    error: LogFunction;
    info: LogFunction;
    warn: LogFunction;
}
type LogFunction = (...args: any[]) => void;

interface PantheonClientConfig {
    debug?: boolean;
    /**
     * URL of your Pantheon Content Cloud instance
     * @example
     * // If your Pantheon Content Cloud instance is hosted at https://pantheon-content-cloud.com
     * // then your host is https://pantheon-content-cloud.com
     * const pantheonClient = new PantheonClient({
     * pccHost: 'https://pantheon-content-cloud.com',
     * });
     */
    pccHost: string;
    /**
     * URL of your Pantheon Content Cloud websocket host
     * @default pccHost
     * @example
     * // If your Pantheon Content Cloud instance is hosted at https://pantheon-content-cloud.com
     * // then your websocket host is wss://pantheon-content-cloud.com
     * const pantheonClient = new PantheonClient({
     *  pccHost: 'https://pantheon-content-cloud.com',
     * pccWsHost: 'wss://pantheon-content-cloud.com',
     * });
     */
    pccWsHost?: string;
}
declare class PantheonClient {
    host: string;
    wsHost: string;
    logger: Logger;
    private debug;
    apolloClient: ApolloClient<NormalizedCacheObject>;
    constructor(config: PantheonClientConfig);
}

interface PantheonProviderProps extends PropsWithChildren<any> {
    client: PantheonClient;
}
declare const PantheonProvider: ({ client, children, }: PantheonProviderProps) => JSX.Element;

interface ArticleQueryArgs {
    contentType?: keyof typeof ContentType;
    publishingLevel?: keyof typeof PublishingLevel;
}
declare function getArticles(client: PantheonClient, args?: ArticleQueryArgs): Promise<ArticleWithoutContent[]>;
declare function getArticle(client: PantheonClient, id: string, args?: ArticleQueryArgs): Promise<Article>;

declare const useArticle: (id: string, args?: ArticleQueryArgs) => {
    article: Article | undefined;
    client: _apollo_client_core_ApolloClient.ApolloClient<any>;
    observable: _apollo_client.ObservableQuery<{
        article: Article;
    }, _apollo_client.OperationVariables>;
    data: {
        article: Article;
    } | undefined;
    previousData?: {
        article: Article;
    } | undefined;
    error?: _apollo_client.ApolloError | undefined;
    loading: boolean;
    networkStatus: _apollo_client.NetworkStatus;
    called: boolean;
    variables: _apollo_client.OperationVariables | undefined;
    startPolling: (pollInterval: number) => void;
    stopPolling: () => void;
    subscribeToMore: <TSubscriptionData = {
        article: Article;
    }, TSubscriptionVariables extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(options: _apollo_client.SubscribeToMoreOptions<{
        article: Article;
    }, TSubscriptionVariables, TSubscriptionData>) => () => void;
    updateQuery: <TVars extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(mapFn: (previousQueryResult: {
        article: Article;
    }, options: Pick<_apollo_client.WatchQueryOptions<TVars, {
        article: Article;
    }>, "variables">) => {
        article: Article;
    }) => void;
    refetch: (variables?: Partial<_apollo_client.OperationVariables> | undefined) => Promise<_apollo_client.ApolloQueryResult<{
        article: Article;
    }>>;
    reobserve: (newOptions?: Partial<_apollo_client.WatchQueryOptions<_apollo_client.OperationVariables, {
        article: Article;
    }>> | undefined, newNetworkStatus?: _apollo_client.NetworkStatus | undefined) => Promise<_apollo_client.ApolloQueryResult<{
        article: Article;
    }>>;
    fetchMore: <TFetchData = {
        article: Article;
    }, TFetchVars extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(fetchMoreOptions: _apollo_client.FetchMoreQueryOptions<TFetchVars, TFetchData> & {
        updateQuery?: ((previousQueryResult: {
            article: Article;
        }, options: {
            fetchMoreResult: TFetchData;
            variables: TFetchVars;
        }) => {
            article: Article;
        }) | undefined;
    }) => Promise<_apollo_client.ApolloQueryResult<TFetchData>>;
};

type ListArticlesResponse = {
    articles: ArticleWithoutContent[];
};
declare const useArticles: (args?: ArticleQueryArgs) => {
    articles: ArticleWithoutContent[] | undefined;
    client: _apollo_client_core_ApolloClient.ApolloClient<any>;
    observable: _apollo_client.ObservableQuery<ListArticlesResponse, _apollo_client.OperationVariables>;
    data: ListArticlesResponse | undefined;
    previousData?: ListArticlesResponse | undefined;
    error?: _apollo_client.ApolloError | undefined;
    loading: boolean;
    networkStatus: _apollo_client.NetworkStatus;
    called: boolean;
    variables: _apollo_client.OperationVariables | undefined;
    startPolling: (pollInterval: number) => void;
    stopPolling: () => void;
    subscribeToMore: <TSubscriptionData = ListArticlesResponse, TSubscriptionVariables extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(options: _apollo_client.SubscribeToMoreOptions<ListArticlesResponse, TSubscriptionVariables, TSubscriptionData>) => () => void;
    updateQuery: <TVars extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(mapFn: (previousQueryResult: ListArticlesResponse, options: Pick<_apollo_client.WatchQueryOptions<TVars, ListArticlesResponse>, "variables">) => ListArticlesResponse) => void;
    refetch: (variables?: Partial<_apollo_client.OperationVariables> | undefined) => Promise<_apollo_client.ApolloQueryResult<ListArticlesResponse>>;
    reobserve: (newOptions?: Partial<_apollo_client.WatchQueryOptions<_apollo_client.OperationVariables, ListArticlesResponse>> | undefined, newNetworkStatus?: _apollo_client.NetworkStatus | undefined) => Promise<_apollo_client.ApolloQueryResult<ListArticlesResponse>>;
    fetchMore: <TFetchData = ListArticlesResponse, TFetchVars extends _apollo_client.OperationVariables = _apollo_client.OperationVariables>(fetchMoreOptions: _apollo_client.FetchMoreQueryOptions<TFetchVars, TFetchData> & {
        updateQuery?: ((previousQueryResult: ListArticlesResponse, options: {
            fetchMoreResult: TFetchData;
            variables: TFetchVars;
        }) => ListArticlesResponse) | undefined;
    }) => Promise<_apollo_client.ApolloQueryResult<TFetchData>>;
};

export { PantheonClient, PantheonProvider, getArticle, getArticles, useArticle, useArticles };
