import React from 'react';
import Label from '../../components/Label';
import LargeValueLabel from '../../components/LargeValueLabel';
import ValueLabel from '../../components/ValueLabel';
import Spacer from '../../components/Spacer';
import PatientIcon from "./PatientIcon";
import styled from 'styled-components';

const PatientIconAndName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: unset;
`;

const PatientIconContainer = styled.div`
  margin-right: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
`;

export default ({ patient = {} }) =>
  <div>
    <Label message='Patient' />
    <PatientIconAndName>
      <PatientIconContainer>
        <PatientIcon icon={patient.icon} backgroundColor={patient.color} inline={true}/>
      </PatientIconContainer>
      <LargeValueLabel message={patient.name || ''} />
    </PatientIconAndName>
    <Spacer size={1}/>
    <Label message='Physician' />
    <ValueLabel message={patient.physician || ''} />
    <Spacer />
  </div>;
