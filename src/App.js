import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import PatientStatus from './pages/PatientStatus';
import FeedbackForm from './pages/FeedbackForm';
import Homepage from './pages/Homepage';
import Manage from './pages/Manage';
import Questionnaire from './pages/Questionnaire';
import ConnectionProvider from './graphql/ConnectionProvider';
import Unauthorized from './pages/Unauthorized';
import SurgeryInstructions from "./pages/SurgeryInstructions";

const App = ({history}) => (
  <Switch>
    <Route path='/manage' component={Manage} />
    <Route
      path='/*/:token'
      render={() =>
        <ConnectionProvider onUnauthorized={() => history.replace('/')}>
          <Switch>
            <Route path='/status/:token' component={PatientStatus} />
            <Route path='/feedback/:token' component={FeedbackForm} />
            <Route path='/instructions/:token' component={SurgeryInstructions} />
            <Route path='/questionnaire/:token' component={Questionnaire} />
            <Route component={Unauthorized} />
          </Switch>
        </ConnectionProvider>
      }
    />
    <Route exact path='/' component={Homepage} />
    <Route component={Unauthorized} />
  </Switch>
);

export default withRouter(App);
