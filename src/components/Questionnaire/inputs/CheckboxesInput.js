import React from 'react'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import FormContext from '../FormContext'
import SingleCheckboxInput from '../SingleCheckboxInput'
import InputWrapper from '../InputWrapper'
import Question from '../Question'
import makeName from '../makeName'

const CheckboxesInput = ({ label, question, checkboxes, omitNone }) => (
  <InputWrapper>
    <Question>{label || question || 'Check all that apply'}</Question>
    <FormContext.Consumer>
      {({ name, value, onChange }) => {
        const handleChange = (v) => {
          const isComplete = Object.values(v || {}).map(x => !!x).indexOf(true) > -1;
          onChange({ checkboxes: v, progress: isComplete ? 1 : 0 });
        };

        return (
          <div>
            {checkboxes.map((checkbox, i) => {
              const label = isArray(checkbox) ? checkbox[0] : checkbox;
              const ifChecked = isArray(checkbox) ? checkbox[1] : undefined;

              return (
                <FormContext.Provider key={i} value={{
                  name: makeName(name, label),
                  value: get(value, ['checkboxes', label]),
                  onChange: v => handleChange({ ...get(value, 'checkboxes', {}), [label]: v }),
                }}>
                  <SingleCheckboxInput label={label} ifChecked={ifChecked} omitNoneIfChecked />
                </FormContext.Provider>
              )
            })}
            {!omitNone && (
              <FormContext.Provider value={{
                name: makeName(name, 'none'),
                value: get(value, 'progress', 0) > 0 && isEmpty(get(value, 'checkboxes')),
                onChange: v => onChange(v ? { checkboxes: [], progress: omitNone ? 0 : 1 } : { checkboxes: null, progress: 0 }),
              }}>
                <SingleCheckboxInput label="None of the above" />
              </FormContext.Provider>
            )}
          </div>
        )
      }}
    </FormContext.Consumer>
  </InputWrapper>
);

CheckboxesInput.defaultValue = { checkboxes: {}, progress: 0 };

export default CheckboxesInput;
