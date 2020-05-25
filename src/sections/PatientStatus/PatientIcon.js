import React from 'react';
import styled from 'styled-components';

const PatientIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  text-align: center;
  overflow: hidden;
  padding: 0.25rem;
`;

const CustomIcon = styled.img`
  width: 1.8em;
  opacity: 0.5;
`;

export default ({ icon, backgroundColor }) => {
  return (
    <PatientIcon style={{ backgroundColor }}>
      <CustomIcon src={require(`../../assets/images/icons/${icon}.png`)} />
    </PatientIcon>
  );
};
