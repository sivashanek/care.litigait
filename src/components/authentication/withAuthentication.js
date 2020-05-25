import React, {useEffect, useState}  from "react";
import TokenAuthentication from "./TokenAuthentication";
import { useLocalStorage } from '@rehooks/local-storage';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import ConnectionProvider from "../../graphql/ConnectionProvider";
import {withRouter} from "react-router";
import { useMutation } from 'react-apollo-hooks'
import { extendAuthenticationCode } from '../../graphql/schema/questionnaire'
import { GlobalStyles } from '../../pages/Questionnaire'
import { H1, H3 } from '../../sections/Questionnaire/QuestionnaireStartPage'
import Spacer from "../Spacer";
import Button from '../Button'

export default Component => withRouter(props => {
  const [sessionToken, setSessionToken, deleteSessionToken] = useLocalStorage(get(props, 'match.params.token'));
  const { token, validUntil } = sessionToken || {};
  // useLocalStorage doesn't work in Safari per this issue https://github.com/rehooks/local-storage/issues/22
  // this is a quickfix until package merges the fix
  const [transientSessionToken, setTransientSessionToken] = useState(token);
  const [isAuthenticated, setIsAuthenticated] = useState(!!transientSessionToken);
  const [justExpired, setJustExpired] = useState(false);

  const extendCode = useMutation(extendAuthenticationCode);

  useEffect(() => {
    const validityInMillis = validUntil ? new Date(validUntil).getTime() - new Date().getTime() : 0;

    if (validityInMillis <= 0) {
      deleteSessionToken();
      setTransientSessionToken(undefined);
      setIsAuthenticated(false);
      return;
    }

    const sessionTimeout = setTimeout(() => {
      setJustExpired(true);
      deleteSessionToken();
      setTransientSessionToken(undefined);
      setIsAuthenticated(false);
    }, validityInMillis);

    return () => {
      clearTimeout(sessionTimeout);
    };
  }, [validUntil]);

  useEffect(() => {
    const validityInMillis = validUntil ? new Date(validUntil).getTime() - new Date().getTime() : 0;
    const refreshDeadline = validityInMillis - 2 * 1000;

    if (refreshDeadline <= 0) {
      deleteSessionToken();
      setTransientSessionToken(undefined);
      setIsAuthenticated(false);
      return;
    }

    const refresh = async () => {
      try {
        const result = await extendCode({ variables: { token } });
        const session = get(result, 'data.extendAuthenticationCode');
        setSessionToken(session);
        setTransientSessionToken(session && session.token);
        setIsAuthenticated(true);
      } catch (e) {
        console.error(e);
      }
    };

    const throttledRefresh = throttle(refresh, /* two minutes */ 2*60*1000, { trailing: true });

    const refreshDeadlineTimeout = setTimeout(() => throttledRefresh.flush(), refreshDeadline);

    window.addEventListener('mousemove', throttledRefresh);
    window.addEventListener('scroll', throttledRefresh);
    window.addEventListener('focus', throttledRefresh);
    window.addEventListener('blur', throttledRefresh);

    return () => {
      clearTimeout(refreshDeadlineTimeout);
      window.removeEventListener('mousemove', throttledRefresh);
      window.removeEventListener('scroll', throttledRefresh);
      window.removeEventListener('focus', throttledRefresh);
      window.removeEventListener('blur', throttledRefresh);
      throttledRefresh.cancel();
    };
  }, [validUntil]);

  const onVerified = session => {
    setSessionToken(session);
    setTransientSessionToken(session && session.token);
    setIsAuthenticated(true);
  };

  const onExpired = () => {
    deleteSessionToken();
    setTransientSessionToken(undefined);
    setIsAuthenticated(false);
  };

  return justExpired ? (
    <div className='Page PageCenter' style={{ textAlign: 'center' }}>
      <GlobalStyles />
      <i className='material-icons' style={{fontSize: '3.2rem'}}>lock</i>
      <Spacer size={1}/>
      <H1>Session expired due to inactivity</H1>
      <H3>You can continue filling the form after you authenticate again.</H3>
      <Button
        label="Continue"
        onClick={() => setJustExpired(false)}
        style={{
          width: 'min-content',
          alignSelf: 'center',
          marginTop: '1rem',
        }}
      />
    </div>
  ) : (
    isAuthenticated ?
      <ConnectionProvider accessToken={transientSessionToken} onUnauthorized={onExpired}>
        <Component {...props} onExpired={onExpired} />
      </ConnectionProvider> : <TokenAuthentication onVerified={onVerified}/>
  );
});
