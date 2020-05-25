import React from 'react';
import Label from '../components/Label';
import Spacer from '../components/Spacer';
import NotAvailable from '../assets/NotAvailable.svg';

const Unauthorized = () =>
  <div className='Page PageCenter'>
    <Spacer size={6} />
    <img alt='' className='PageIcon' src={NotAvailable} />
    <Spacer size={2} />
    <Label message='The requested page does not exist or has expired.' />
    <Spacer size={2} />
  </div>;

export default Unauthorized;
