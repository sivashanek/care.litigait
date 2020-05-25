import React from 'react';
import './PatientStatusDetails.css';
import {
  getCurrentStatus,
  getStatusObject,
  getStatusTimestamps,
} from './helpers';
import VerticalProgressBar from './status/VerticalProgressBar';
import VerticalLabelColumn from './status/VerticalLabelColumn';
import VerticalTimeColumn from './status/VerticalTimeColumn';
import Label from '../../components/Label';
import Spacer from '../../components/Spacer';

export default ({ patient = {} }) => {
  const currentStatus = getCurrentStatus(patient.events || {});
  const statusObject = getStatusObject(patient.events || {});
  const statusTimestamps = getStatusTimestamps(patient.events || {});

  return (
    <React.Fragment>
      <div className='PatientStatusDetailsHeader'>
        <Label message='Status' />
        <Label message='Time' />
      </div>
      <Spacer />
      <div className='PatientStatusDetails'>
        <VerticalProgressBar
          {...statusObject}
          current={currentStatus}
        />
        <VerticalLabelColumn
          {...statusObject}
          current={currentStatus}
        />
        <VerticalTimeColumn
          {...statusTimestamps}
          current={currentStatus}
        />
      </div>
    </React.Fragment>
  );
}
