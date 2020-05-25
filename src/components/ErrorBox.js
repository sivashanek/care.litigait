import React from 'react';
import './ErrorBox.css';

export default ({ children, style }) =>
  <div className='ErrorBox' style={style}>
    {children}
  </div>
