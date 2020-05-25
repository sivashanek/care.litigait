import React, { useMemo } from 'react'
import styled from 'styled-components'
import isArray from 'lodash/isArray'
import FormContext from './FormContext'
import renderFormNode from './renderFormNode'
import components from './components'
import CheckboxLabel from './CheckboxLabel'
import CheckboxWrapper from './CheckboxWrapper'
import CheckboxInput from './inputs/CheckboxInput'
import Checkmark from './Checkmark'
import { NestedFormWrapper } from "./inputs/YesNoInput"
import get from 'lodash/get';

export const Checkbox = props => (
  <CheckboxWrapper style={get(props, 'wrapperStyle')}>
    <CheckboxInput {...props} />
    <Checkmark/>
    {/*<CheckboxSvg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">*/}
    {/*  {props.checked ? (*/}
    {/*    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>*/}
    {/*  ) : (*/}
    {/*    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>*/}
    {/*  )}*/}
    {/*</CheckboxSvg>*/}
  </CheckboxWrapper>
);

const CheckboxNestable = styled.div`
  > div:last-of-type {
    margin-bottom: 2em;
    
    &:empty {
      margin-bottom: 0;
    }
  }
`;

const makeName = (name, key) =>  name ? `${name}.${key}` : key;

const SingleCheckboxInput = ({ label, ifChecked, omitNoneIfChecked }) => {
  const ifCheckedNode = useMemo(() => {
    return ifChecked && React.cloneElement(renderFormNode(ifChecked), { autoFocus: true, omitNone: omitNoneIfChecked });
  }, [ifChecked, omitNoneIfChecked]);

  return (
    <FormContext.Consumer>
      {({ name, value, onChange }) => {
        const handleChange = e => {
          if (ifChecked) {
            onChange(e.target.checked ? [true, (components()[ifChecked['type']] || {}).defaultValue] : null);
          } else {
            onChange(e.target.checked || null);
          }
        };

        const checked = (isArray(value) ? value[0] : value) === true;

        return (
          <CheckboxNestable>
            <CheckboxLabel>
              <Checkbox type="checkbox" name={name} value="No" checked={checked} onChange={handleChange} /> <span>{label}</span>
            </CheckboxLabel>
            {checked && (
              <NestedFormWrapper>
                <FormContext.Provider value={{
                  name: makeName(name, 'yes'),
                  value: value[1],
                  onChange: v => onChange([true, v]),
                }}>
                  {ifCheckedNode}
                </FormContext.Provider>
              </NestedFormWrapper>
            )}
          </CheckboxNestable>
        )
      }}
    </FormContext.Consumer>
  );
};

SingleCheckboxInput.defaultValue = false;

export default SingleCheckboxInput;
