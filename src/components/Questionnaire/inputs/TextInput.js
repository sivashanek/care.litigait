import React, {useState} from 'react'
import get from 'lodash/get'
import set from 'lodash/set'
import cloneDeep from 'lodash/cloneDeep'
import FormContext from '../FormContext'
import InputWrapper from '../InputWrapper'
import InputLabel from '../InputLabel'
import Input from '../Input'

// TODO: Move this to schema
const implicitMaxLength = question => {
  if (question.startsWith('Year')) {
    return 12;
  } else if (question.startsWith('Type')) {
    return 10;
  } else if (question.startsWith('Last')) {
    return 10;
  } else if (question.startsWith('What year did you quit?')) {
    return 5;
  } else if (question.startsWith('Location')) {
    return 10;
  } else if (question.startsWith('When was it placed')) {
    return 14;
  } else if (question.startsWith('When was your last seizure? MM/YY')) {
    return 6;
  } else if (question.startsWith('Body Part')) {
    return 20;
  } else if (question.startsWith('Usage')) {
    return 20;
  } else if (question.startsWith('Extremity')) {
    return 25;
  } else if (question.startsWith('Cigarettes per day')) {
    return 25;
  } else if (question.startsWith('When was your last menstrual period')) {
    return 25;
  } else if (question.startsWith('How Many')) {
    return 10;
  }
  return 34;
};

const lengthHelper = length => value => {
  const text = get(value, 'text', '');
  if(text.length === 0) {
    return `Maximal length ${length} characters`;
  } else {
    const remaining = length - text.length;
    return `${remaining} character${remaining === 1 ? '' : 's'} remaining`;
  }
};

const TextInput = ({ label, optional, section, ...props }) => {
  const [helpVisible, setHelpVisible] = useState(false);
  const shouldLimit = section !== 'demographicInformation';
  return (
    <FormContext.Consumer>
      {({ name, value, onChange }) => (
        <InputWrapper>
          <span style={{display: 'flex', justifyContent: 'space-between', flex: '1 0 auto'}}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            {helpVisible && <label style={{fontSize: '0.9em'}}>{lengthHelper(implicitMaxLength(label))(value)}</label>}
          </span>
          <Input
            type="text"
            id={name}
            name={name}
            value={get(value, 'text', '')}
            onChange={e => onChange({ text: e.target.value, progress: get(value, 'progress', 0) })}
            onBlur={() => {
              onChange(set(cloneDeep(value || {}), 'progress', get(value, 'text', '').length > 0 && !optional ? 1 : 0));
              setHelpVisible(false)
            }}
            onFocus={() => setHelpVisible(shouldLimit)}
            maxLength={shouldLimit ? implicitMaxLength(label) : undefined}
            {...props}
          />
          {/*{get(value, 'progress', 0) > 0 && '✅'}*/}
        </InputWrapper>
      )}
    </FormContext.Consumer>
  )
};

TextInput.defaultValue = { text: '', progress: 0 };

export default TextInput;
