import React from 'react';
import PropTypes from 'prop-types';
import './VerticalProgressBarNode.css';

const Node = ({ active, current, lastItem }) =>
  <React.Fragment>
    <li>
      <div
        className={`Node ${active ? 'ActiveNode' : ''} ${current ? 'CurrentNode' : ''}`}
      >
        {''}
      </div>
    </li>
    {!lastItem &&
    <li>
      <div
        className={`Divider ${active ? 'ActiveDivider' : ''} ${current ? 'CurrentDivider' : ''}`}
      >
        {''}
      </div>
    </li>
    }
  </React.Fragment>;

Node.propTypes = {
  active: PropTypes.bool.isRequired,
  current: PropTypes.bool.isRequired,
  lastItem: PropTypes.bool,
};

export default Node;
