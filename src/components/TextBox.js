import React from 'react';
import './TextBox.css';
import Label from './ValueLabel';

const TextBox = ({ id, name, label, value, onChange, disabled }) =>
  <React.Fragment>
    <Label message={label} />
    <textarea
      name={name}
      className='TextBox'
      rows='10'
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ borderColor: 'rgba(255, 255, 255, .25)' }}
    />
  </React.Fragment>;

export default TextBox;
