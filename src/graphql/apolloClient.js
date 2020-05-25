import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';

import config from '../config';

const RESPONSE_UNAUTHORIZED = 'Unauthorized';

export const createApolloClient = (accessToken, organizationId, onUnauthorized, onConnected, onDisconnected) => {
  const [protocol, host] = config.apiURL.split('://');
  const endpoint = `${protocol === 'https' ? 'wss' : 'ws'}://${host}/graphql`;

  const subscriptionClient = new SubscriptionClient(endpoint, {
    reconnect: true,
    connectionParams: organizationId ? { accessToken, organizationId } : { accessToken },
    connectionCallback: error => {
      if (error && error === RESPONSE_UNAUTHORIZED) {
        subscriptionClient.close();
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
    },
  });

  if (onConnected) {
    subscriptionClient.onConnected(onConnected);
    subscriptionClient.onReconnected(onConnected);
  }

  if (onDisconnected) {
    subscriptionClient.onDisconnected(onDisconnected);
  }

  const apolloClient = new ApolloClient({
    link: new WebSocketLink(subscriptionClient),
    cache: new InMemoryCache(),
  });

  return [apolloClient, subscriptionClient];
};
