import React from 'react';
import Label from './Label';

export default ({ message, ...rest }) =>
  <Label
    message={message}
    cssModifer='label__value label__value--large'
    {...rest}
  />;
