import React from 'react';
import { graphql } from 'react-apollo';
import './pages.css';
import HospitalInformation from '../sections/PatientStatus/HospitalInformation';
import { patientSubscription } from '../graphql/schema/familyMember';
import ActivePatient from '../sections/PatientStatus/ActivePatient';
import DischargedPatient from '../sections/PatientStatus/DischargedPatient';

const PatientStatus = ({ data = {} }) => {
  const { familyMember: patient} = data;
  if (patient === undefined) {
    return null;
  }

  if (
    patient === null ||
    (patient && patient.events.dischargedAt && patient.events.dischargedAt)
  ) {
    return (
      <div className='Page PageColumn'>
        <DischargedPatient />
        <HospitalInformation />
      </div>
    )
  }

  return (
    <div className='Page PageColumn'>
      <ActivePatient patient={patient} />
      <HospitalInformation />
    </div>
  );
};

export default graphql(patientSubscription)(PatientStatus);
