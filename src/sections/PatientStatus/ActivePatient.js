import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import PatientStatusDetails from './PatientStatusDetails';

const ActivePatient = ({ patient }) =>
  <React.Fragment>
    <Header patient={patient} />
    <PatientStatusDetails patient={patient} />
  </React.Fragment>;

ActivePatient.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    physician: PropTypes.string.isRequired,
    events: PropTypes.shape({
      admittedAt: PropTypes.string,
      preOpAt: PropTypes.string,
      orAt: PropTypes.string,
      recoveryAt: PropTypes.string,
      ableToVisitAt: PropTypes.string,
      dischargedAt: PropTypes.string,
    })
  }),
};

export default ActivePatient;
