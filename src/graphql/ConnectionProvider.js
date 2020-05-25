import React, { Children, Fragment } from 'react';
import { ApolloProvider } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose, mapProps } from 'recompose';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { createApolloClient } from './apolloClient';
import {format} from "date-fns";
import ErrorBox from '../components/ErrorBox';
import delay from 'lodash/delay';

const optionalDateFormat = date => date ? format(date, 'hh:mm A') : date;

class ConnectionProvider extends React.PureComponent {
  state = { apolloClient: undefined, subscriptionClient: undefined, lastDisconnectedAt: null };

  constructor(props) {
    super(props);
    this.timer = null;
  }

  componentWillMount() {
    const { accessToken, organizationId, onUnauthorized } = this.props;
    this.createApolloClientFactory(accessToken, organizationId, onUnauthorized);
    this._mounted = true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { accessToken, organizationId, onUnauthorized } = this.props;
    if (prevProps.accessToken !== accessToken) {
      this.cleanupApollo(prevState);
      this.createApolloClientFactory(accessToken, organizationId, onUnauthorized);
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this.cleanupApollo(this.state);
  }

  cleanupApollo = ({ apolloClient, subscriptionClient }) => {
    if (apolloClient) {
      apolloClient.stop();
    }

    if (subscriptionClient) {
      subscriptionClient.close();
    }
  };

  createApolloClientFactory = (accessToken, organizationId, onUnauthorized) => {
    const [apolloClient, subscriptionClient] = createApolloClient(
      accessToken,
      organizationId,
      onUnauthorized,
      this.onConnected,
      this.onDisconnected
    );

    this.setState({ apolloClient, subscriptionClient });
  };

  setLastDisconnected = value => {
    if (this._mounted) {
      this.setState({ lastDisconnectedAt: value });
    }
    this.timer = null;
  };

  scheduleSwitch = (after, value) => {
    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    this.timer = delay(this.setLastDisconnected, after, value);
  };

  onConnected = () => {
    this.scheduleSwitch(100, null);
  };

  onDisconnected = () => {
    if (this.state.lastDisconnectedAt == null) {
      this.scheduleSwitch(10000, new Date());
    }
  };

  render() {
    const { apolloClient: client, lastDisconnectedAt } = this.state;
    return client ? (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Fragment>
            {lastDisconnectedAt &&
              <ErrorBox style={{ maxWidth: '620px', margin: '0 auto' }}>
                <span className='material-icons'>warning</span>
                {`You are currently disconnected. Last time online was at ${optionalDateFormat(lastDisconnectedAt)}.`}
              </ErrorBox>
            }
            {Children.only(this.props.children)}
          </Fragment>
        </ApolloHooksProvider>
      </ApolloProvider>
    ) : null;
  }
}

ConnectionProvider.displayName = 'ConnectionProvider';

export default compose(
  withRouter,
  mapProps(({ match, accessToken, organizationId, ...props }) => ({ accessToken: accessToken || match.params.token, organizationId, ...props }))
)(ConnectionProvider);
