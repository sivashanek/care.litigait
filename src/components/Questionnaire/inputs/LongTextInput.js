import React from 'react'
import get from 'lodash/get'
import FormContext from '../FormContext'
import Input from '../Input'
import InputWrapper from '../InputWrapper'
import InputLabel from '../InputLabel'

const Textarea = Input.withComponent('textarea');

const LongTextInput = ({ label, onChange, ...props }) => (
  <FormContext.Consumer>
    {({ name, value, onChange }) => (
      <InputWrapper>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        <Textarea id={name} name={name} value={get(value, 'text', '')} onChange={e => onChange({ text: e.target.value, progress : e.target.value ? 1 : 0 })} {...props} />
      </InputWrapper>
    )}
  </FormContext.Consumer>
);

LongTextInput.defaultValue = { text: '', progress: 0 };

export default LongTextInput;
