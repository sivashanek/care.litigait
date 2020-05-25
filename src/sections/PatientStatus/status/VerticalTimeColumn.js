import React from 'react';
import PropTypes from 'prop-types';
import './VerticalLabelColumn.css';
import PatientStatus from '../../../enums/PatientStatus';
import ValueLabel from '../../../components/ValueLabel';

const VerticalTimeColumn = ({
   current,
   ADMITTED,
   PRE_OP,
   IN_OR,
   PACU,
   ABLE_TO_VISIT,
  }) =>
  <div className='VerticalLabelColumn PushedVerticalLabelColumn'>
    <div className={current === PatientStatus.ADMITTED ? 'CurrentLabelInVerticalColumn' : ''}>
      <ValueLabel message={ADMITTED || '-'} inactive={!ADMITTED} />
    </div>
    <div className={current === PatientStatus.PRE_OP ? 'CurrentLabelInVerticalColumn' : ''}>
      <ValueLabel message={PRE_OP || '-'} inactive={!PRE_OP } />
    </div>
    <div className={current === PatientStatus.IN_OR ? 'CurrentLabelInVerticalColumn' : ''}>
      <ValueLabel message={IN_OR || '-'} inactive={!IN_OR } />
    </div>
    <div className={current === PatientStatus.PACU ? 'CurrentLabelInVerticalColumn' : ''}>
      <ValueLabel message={PACU || '-'} inactive={!PACU } />
    </div>
    <div className={current === PatientStatus.ABLE_TO_VISIT ? 'CurrentLabelInVerticalColumn' : ''}>
      <ValueLabel message={ABLE_TO_VISIT || '-'} inactive={!ABLE_TO_VISIT } />
    </div>
  </div>;

VerticalTimeColumn.propTypes = {
  [PatientStatus.ADMITTED]: PropTypes.string,
  [PatientStatus.PRE_OP]: PropTypes.string,
  [PatientStatus.IN_OR]: PropTypes.string,
  [PatientStatus.PACU]: PropTypes.string,
  [PatientStatus.ABLE_TO_VISIT]: PropTypes.string,
  current: PropTypes.oneOf([
    PatientStatus.ADMITTED,
    PatientStatus.PRE_OP,
    PatientStatus.IN_OR,
    PatientStatus.PACU,
    PatientStatus.ABLE_TO_VISIT,
  ]).isRequired,
};

export default VerticalTimeColumn;
