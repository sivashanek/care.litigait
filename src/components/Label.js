import React from 'react';
import './Label.css';

export default ({ message, cssModifer = '', inactive }) =>
  <label
    className={`label ${cssModifer} ${inactive ? 'label--inactive' : ''}`}
  >
    {message}
  </label>;
