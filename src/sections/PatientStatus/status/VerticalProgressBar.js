import React from 'react';
import PropTypes from 'prop-types';
import Node from './VerticalProgressBarNode';
import './VerticalProgressBar.css';
import PatientStatus from '../../../enums/PatientStatus';

const VerticalProgressBar = ({
   ADMITTED,
   PRE_OP,
   IN_OR,
   PACU,
   ABLE_TO_VISIT,
   current,
}) =>
  <ul className='VerticalProgressBar'>
    <Node
      active={ADMITTED}
      current={current === PatientStatus.ADMITTED}
    />
    <Node
      active={PRE_OP}
      current={current === PatientStatus.PRE_OP}
    />
    <Node
      active={IN_OR}
      current={current === PatientStatus.IN_OR}
    />
    <Node
      active={PACU}
      current={current === PatientStatus.PACU}
    />
    <Node
      active={ABLE_TO_VISIT}
      current={current === PatientStatus.ABLE_TO_VISIT}
      lastItem
    />
  </ul>;

VerticalProgressBar.propTypes = {
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

export default VerticalProgressBar;
