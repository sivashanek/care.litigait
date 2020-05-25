import React, { useContext, useRef } from 'react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import FormContext from '../FormContext';
import InputWrapper from '../InputWrapper'
import InputLabel from '../InputLabel'
import HorizontalFields from '../HorizontalFields'
import Input from '../Input'
import makeName from '../makeName'

const DateOfBirthInput = () => {
  const { name, value, onChange } = useContext(FormContext);

  const dayRef = useRef();
  const yearRef = useRef();

  const monthName = makeName(name, 'month');
  const dayName = makeName(name, 'day');
  const yearName = makeName(name, 'year');

  const month = get(value, ['dateOfBirth', 'month'], '');
  const day = get(value, ['dateOfBirth', 'day'], '');
  const year = get(value, ['dateOfBirth', 'year'], '');

  const handleChange = (name, min, max) => e => {
    const nextInputvalue = e.target.value.replace(/\D/g,'');
    const numericalNextInputValue = parseInt(nextInputvalue, '10');
    if (numericalNextInputValue < min || numericalNextInputValue > max) {
      return;
    }
    if (name === 'month') {
      if (nextInputvalue.length >= e.target.maxLength && dayRef.current) {
        dayRef.current.focus();
        dayRef.current.setSelectionRange(0, dayRef.current.value.length);
      }
    } else if (name === 'day') {
      if (nextInputvalue.length >= e.target.maxLength && yearRef.current) {
        yearRef.current.focus();
        yearRef.current.setSelectionRange(0, yearRef.current.value.length);
      }
    }
    const nextValue = set(value ? cloneDeep(value) : {}, ['dateOfBirth', name], nextInputvalue);
    const ok = (name, length) => get(nextValue, ['dateOfBirth', name], '').length >= length;
    const done = ok('month', 1) && ok('day', 1) && ok('year', 4);
    onChange(cloneDeep(set(nextValue, 'progress', done ? 1 : 0)));
  };

  const padDigits = field => e => {
    try {
      const val = e.target.value;
      if (val && val.length === 1) {
          e.target.value = `0${val}`;
      }

      handleChange(field)(e)
    } catch(e) {

    }
  };

  const handleYearBlur = e => {
    try {
      const val = e.target.value;
      if (val && val.length === 2) {
        const end00Year = new Date().getFullYear() % 1000;
        if (parseInt(val, 10) > end00Year) {
          e.target.value = `19${val}`;
        } else {
          e.target.value = `20${val}`;
        }
      }

      handleChange('year')(e)
    } catch(e) {

    }
  };

  return (
    <InputWrapper>
      <InputLabel htmlFor={!month ? monthName : (!day ? dayName : (!year ? yearName : monthName))}>Date of Birth</InputLabel>
      <HorizontalFields>
        <div>
          <InputLabel htmlFor={monthName}>Month</InputLabel>
          <Input
            placeholder="MM"
            type="text"
            id={monthName}
            name={monthName}
            value={month}
            onChange={handleChange('month', 0, 12)}
            onBlur={padDigits('month')}
            length={2}
            maxLength={2}
          />
        </div>
        <div>
          <InputLabel htmlFor={dayName}>Day</InputLabel>
          <Input
            type="text"
            placeholder="DD"
            ref={dayRef}
            id={dayName}
            name={dayName}
            value={day}
            onChange={handleChange('day', 0, 31)}
            onBlur={padDigits('day')}
            length={2}
            maxLength={2}
          />
        </div>
        <div>
          <InputLabel htmlFor={yearName}>Year</InputLabel>
          <Input
            type="text"
            placeholder="YYYY"
            ref={yearRef}
            id={yearName}
            name={yearName}
            value={year}
            onChange={handleChange('year', 0, new Date().getFullYear())}
            length={4}
            maxLength={4}
            onBlur={handleYearBlur}
          />
        </div>
      </HorizontalFields>
      {/*{get(value, 'progress', 0) > 0 && '✅'}*/}
    </InputWrapper>
  );
};

DateOfBirthInput.defaultValue = { dateOfBirth: {}, progress: 0 };

export default DateOfBirthInput;
