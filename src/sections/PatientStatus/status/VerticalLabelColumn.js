import React from 'react';
import PropTypes from 'prop-types';
import './VerticalLabelColumn.css';
import PatientStatus from '../../../enums/PatientStatus';
import ValueLabel from '../../../components/ValueLabel';

const VerticalLabelColumn = ({
  current,
  ADMITTED,
  PRE_OP,
  IN_OR,
  PACU,
  ABLE_TO_VISIT,
}) =>
  <div className='VerticalLabelColumn'>
    <div className={`${current === PatientStatus.ADMITTED ? 'CurrentLabelInVerticalColumn' : ''} ${!ADMITTED ? 'InactiveLabel' : ''}`}>
      <ValueLabel message='Admitted' />
    </div>
    <div className={`${current === PatientStatus.PRE_OP ? 'CurrentLabelInVerticalColumn' : ''} ${!PRE_OP ? 'InactiveLabel' : ''}`}>
      <ValueLabel message='Pre Op' />
    </div>
    <div className={`${current === PatientStatus.IN_OR ? 'CurrentLabelInVerticalColumn' : ''} ${!IN_OR ? 'InactiveLabel' : ''}`}>
      <ValueLabel message='OR' />
    </div>
    <div className={`${current === PatientStatus.PACU ? 'CurrentLabelInVerticalColumn' : ''} ${!PACU ? 'InactiveLabel' : ''}`}>
      <ValueLabel message='Recovery' />
    </div>
    <div className={`${current === PatientStatus.ABLE_TO_VISIT ? 'CurrentLabelInVerticalColumn' : ''} ${!ABLE_TO_VISIT ? 'InactiveLabel' : ''}`}>
      <ValueLabel message='Able to visit' />
    </div>
  </div>;

VerticalLabelColumn.propTypes = {
  [PatientStatus.ADMITTED]: PropTypes.bool.isRequired,
  [PatientStatus.PRE_OP]: PropTypes.bool.isRequired,
  [PatientStatus.IN_OR]: PropTypes.bool.isRequired,
  [PatientStatus.PACU]: PropTypes.bool.isRequired,
  [PatientStatus.ABLE_TO_VISIT]: PropTypes.bool.isRequired,
  current: PropTypes.oneOf([
    PatientStatus.ADMITTED,
    PatientStatus.PRE_OP,
    PatientStatus.IN_OR,
    PatientStatus.PACU,
    PatientStatus.ABLE_TO_VISIT,
  ]).isRequired,
};

export default VerticalLabelColumn;
