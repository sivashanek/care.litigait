import React from 'react';
import Label from '../../components/Label';
import Spacer from '../../components/Spacer';

const DischargedPatient = () =>
  <React.Fragment>
    <Spacer size={6} />
    <h1>Patient visit has been completed.</h1>
    <Label message='Information about this patient is no longer available.' />
    <Spacer size={2} />
  </React.Fragment>;

export default DischargedPatient;
