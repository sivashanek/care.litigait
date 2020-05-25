import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router'
import ConnectionProvider from '../graphql/ConnectionProvider';
import Questionnaire from '../pages/Questionnaire';
import config from '../config';
import './pages.css';
import Unauthorized from './Unauthorized'
import SurgeryInstructions from "./SurgeryInstructions";

export default ({ history }) => {
  const [{ accessToken, organizationId }, setData] = useState({});

  useEffect(() => {
    const handleMessage = event => {
      if (event.origin !== config.appURL) {
        return;
      }

      setData(event.data || {});
    };

    window.addEventListener('message', handleMessage, false);

    window.opener.postMessage({ method: 'GetAccessToken' }, config.appURL);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div>
      {accessToken ? (
        <ConnectionProvider accessToken={accessToken} organizationId={organizationId} onUnauthorized={() => history.replace('/')}>
          <Switch>
            <Route path='/manage/questionnaire/:id' component={Questionnaire} />
            <Route path='/manage/instructions/:id/:version' component={SurgeryInstructions} />
            <Route path='/manage/instructions/:id' component={SurgeryInstructions} />
            <Route component={Unauthorized} />
          </Switch>
        </ConnectionProvider>
      ) : null}
    </div>
  );
}
