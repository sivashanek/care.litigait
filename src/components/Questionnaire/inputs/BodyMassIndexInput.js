import React, { useContext, useRef } from 'react'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import FormContext from '../FormContext'
import InputWrapper from '../InputWrapper'
import InputLabel from '../InputLabel'
import HorizontalGroup from '../HorizontalGroup'
import HorizontalFields from '../HorizontalFields'
import makeName from '../makeName'
import Input from '../Input'

const BodyMassIndexInput = () => {
  const { name, value, onChange } = useContext(FormContext);

  const heightInRef = useRef();
  const weightLbRef = useRef();

  const heightFtName = makeName(name, 'heightFt');
  const heightInName = makeName(name, 'heightIn');
  const weightLbName = makeName(name, 'weightLb');

  const heightFt = get(value, ['bodyMassIndex', 'heightFt'], '');
  const heightIn = get(value, ['bodyMassIndex', 'heightIn'], '');
  const weightLb = get(value, ['bodyMassIndex', 'weightLb'], '');

  const handleChange = (name, min, max) => e => {
    const nextInputvalue = e.target.value.replace(/\D/g,'');
    if (isFinite(min) && isFinite(max)) {
      const numericalNextInputValue = parseInt(nextInputvalue, '10')
      if (numericalNextInputValue < min || numericalNextInputValue > max) {
        return;
      }
    }
    if (name === 'heightFt') {
      if (nextInputvalue.length >= e.target.maxLength && heightInRef.current) {
        heightInRef.current.focus();
        heightInRef.current.setSelectionRange(0, heightInRef.current.value.length);
      }
    } else if (name === 'heightIn') {
      if (nextInputvalue.length >= e.target.maxLength && weightLbRef.current) {
        weightLbRef.current.focus();
        weightLbRef.current.setSelectionRange(0, weightLbRef.current.value.length);
      }
    }
    const nextValue = set(value ? cloneDeep(value) : {}, ['bodyMassIndex', name], nextInputvalue);
    const ok = (name, length) => get(nextValue, ['bodyMassIndex', name], '').length >= length;
    const done = ok('heightFt', 1) && ok('heightIn', 1) && ok('weightLb', 1);
    onChange(cloneDeep(set(nextValue, 'progress', done ? 1 : 0)));
  };

  return (
    <HorizontalGroup>
      <div>
        <InputWrapper>
          <InputLabel htmlFor={heightFt && !heightIn ? heightInName : heightFtName}>Height</InputLabel>
          <HorizontalFields>
            <div>
              <InputLabel htmlFor={heightFtName}>Feet</InputLabel>
              <Input
                type="text"
                id={heightFtName}
                name={heightFtName}
                value={heightFt}
                onChange={handleChange('heightFt')}
                maxLength={1}
              />
            </div>
            <div>
              <InputLabel htmlFor={heightInName}>Inches</InputLabel>
              <Input
                type="text"
                ref={heightInRef}
                id={heightInName}
                name={heightInName}
                value={heightIn}
                onChange={handleChange('heightIn', 0, 12)}
                maxLength={2}
              />
            </div>
          </HorizontalFields>
        </InputWrapper>
      </div>
      <div>
        <InputWrapper>
          <InputLabel htmlFor={weightLbName}>Weight</InputLabel>
          <HorizontalFields>
            <div>
              <InputLabel htmlFor={weightLbName}>Pounds</InputLabel>
              <Input
                type="text"
                ref={weightLbRef}
                id={weightLbName}
                name={weightLbName}
                value={weightLb}
                onChange={handleChange('weightLb')}
                maxLength={3}
              />
            </div>
          </HorizontalFields>
        </InputWrapper>
      </div>
      {/*{get(value, 'progress', 0) > 0 && '✅'}*/}
    </HorizontalGroup>
  );
};

BodyMassIndexInput.defaultValue = { bodyMassIndex: {}, progress: 0 };

export default BodyMassIndexInput;
