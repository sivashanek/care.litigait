import React from 'react';
import Label from '../../components/Label';
import Spacer from '../../components/Spacer';

export default () =>
  <div className='Page PageCenter' style={{ textAlign: 'center' }}>
    <Spacer size={8} />
    <h1>Thank you!</h1>
    <Label message='Your suggestion has been sent.' />
  </div>;
