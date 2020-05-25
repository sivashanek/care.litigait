import React from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import FormContext from '../FormContext';
import renderFormNode from '../renderFormNode';
import components from '../components';
import makeName from '../makeName'
import Question from '../Question'
import {Heading} from "./SectionsInput";

const SelectInput = styled.select`
  display: inline-block;
  width: 100%;
  height: 3em;
  padding-left: .5em;
  padding-right: .5em;
  font-size: 1em;
  color: #000C3F;
  vertical-align: middle;
  background: rgba(0, 12, 63, 0.05);
  border: none;
  border-radius: 0;
  border-bottom: .125em solid #000C3F;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border-color 0.2s ease-in-out;
`;

const OneOfInput = ({ label, question, options, distinguish }) => (
  <FormContext.Consumer>
    {({ name, value, onChange }) => {
      const valueName = isArray(get(value, 'option')) ? get(value, ['option', 0]) : get(value, 'option');
      const currentOption = options.find(option => (isArray(option) ? option[0] : option) === valueName);
      const ifSelected = isArray(currentOption) ? currentOption[1] : null;
      const handleChange = e => {
        const v = e.target.value;
        const o = options.find(option => (isArray(option) ? option[0] : option) === v);
        onChange({
          option: isArray(o) ? [o[0], components()[o[1].type].defaultValue] : o,
          progress: o !== undefined ? 1 : 0,
        });
      };
      return (
        <div style={{ marginBottom: distinguish ? '2.5em' : '1.75em' }}>
          {distinguish && <Heading>{distinguish}</Heading>}
          <Question>{label || question}</Question>
          <SelectInput value={isArray(get(value, 'option')) ? get(value, ['option', 0]) : get(value, 'option')} onChange={handleChange}>
            <option name="">Choose an option</option>
            {options.map((option, i) => {
              const l = isArray(option) ? option[0] : option;

              return (
                <option key={i} name={l}>{l}</option>
              );
            })}
          </SelectInput>
          {ifSelected && (
            <div style={{ marginTop: '1.75em' }}>
              <FormContext.Provider value={{
                name: makeName(name, valueName),
                value: get(value, ['option', 1]),
                onChange: v => onChange({ option: [valueName, v], progress: 1 }),
              }}>
                {renderFormNode(ifSelected)}
              </FormContext.Provider>
            </div>
          )}
        </div>
      )
    }}
  </FormContext.Consumer>
);

OneOfInput.defaultValue = { option: '', progress: 0 };

export default OneOfInput;
