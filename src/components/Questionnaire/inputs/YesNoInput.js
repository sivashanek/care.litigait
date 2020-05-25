import React, { Fragment, useMemo } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import FormContext from '../FormContext';
import renderFormNode from '../renderFormNode';
import components from '../components';
import CheckboxWrapper from '../CheckboxWrapper'
import CheckboxInput from './CheckboxInput'
import Checkmark from '../Checkmark'
import InputWrapper from '../InputWrapper'
import Question from '../Question'
import CheckboxLabel from '../CheckboxLabel'

export const NestedFormWrapper = styled.div`
  border-left: .125em solid rgba(0, 12, 63, 0.15);
  padding-left: 1.5em;
  margin-top: 1.25em;
  margin-left: 1.125em;
  
  &:empty {
    margin: 0;
  }
  
  > *:last-of-type {
    margin-bottom: 0;
  }
`;

const InlineCheckbox = styled.div`
  display: flex;
  align-items: center;
  
  > label {
    margin-bottom: 0;
    flex: 0 1 33%;
    min-width: 6em;
  }
`;

const Checkbox = props => (
  <CheckboxWrapper>
    <CheckboxInput {...props} />
    <Checkmark />
    {/*<CheckboxSvg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">*/}
    {/*  {props.checked ? (*/}
    {/*    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>*/}
    {/*  ) : (*/}
    {/*    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>*/}
    {/*  )}*/}
    {/*</CheckboxSvg>*/}
  </CheckboxWrapper>
);

const makeName = (name, key) =>  name ? `${name}.${key}` : key;

const YesNoInput = ({ question, ifYes, ifNo, ...props }) => {
  const ifYesNode = useMemo(() => {
    return ifYes && React.cloneElement(renderFormNode(ifYes), { autoFocus: true, omitNone: true });
  }, [ifYes]);

  const ifNoNode = useMemo(() => {
    return ifNo && React.cloneElement(renderFormNode(ifNo), { autoFocus: true, omitNone: true });
  }, [ifNo]);

  return (
    <InputWrapper>
      <Question>{question}</Question>
      <FormContext.Consumer>
        {({ name, value, onChange }) => {
          const handleChange = value => {
            let progress = 0;

            if (isArray(value)) {
              if (value[0] === true || value[0] === false) {
                progress += 1;
              }
              if (value[0] === true) {
                progress += get(value, [1, 'progress'], 0) + get(ifNo, 'weight', 0);
              }
              if (value[0] === false) {
                progress += get(value, [1, 'progress'], 0) + get(ifYes, 'weight', 0);
              }
            } else {
              if (value === true || value === false) {
                progress += 1;
              }
              if (value === true) {
                progress += get(value, 'progress', 0) + get(ifNo, 'weight', 0);
              }
              if (value === false) {
                progress += get(value, 'progress', 0) + get(ifYes, 'weight', 0);
              }
            }

            onChange({ yes: value, progress });
          }

          const handleYesChange = e => {
            if (ifYes) {
              handleChange(e.target.checked ? [true, (components()[ifYes['type']] || {}).defaultValue] : null);
            } else {
              handleChange(e.target.checked || null);
            }
          };

          const handleNoChange = e => {
            if (ifNo) {
              handleChange(e.target.checked ? [false, (components()[ifNo['type']] || {}).defaultValue] : null);
            } else {
              handleChange(e.target.checked ? false : null);
            }
          };

          const yes = get(value, 'yes');
          const yesValue = (isArray(yes) ? yes[0] : yes) === true;
          const noValue = (isArray(yes) ? yes[0] : yes) === false;

          return (
            <Fragment>
              {/*{get(value, 'progress', 0) > 0 && '✅'}*/}
              <InlineCheckbox>
                <CheckboxLabel>
                  <Checkbox type="checkbox" name={name} value="No" checked={noValue} onChange={handleNoChange} /> No
                </CheckboxLabel>
                <CheckboxLabel>
                  <Checkbox type="checkbox" name={name} value="Yes" checked={yesValue} onChange={handleYesChange} /> Yes
                </CheckboxLabel>
              </InlineCheckbox>

              {noValue && (
                <NestedFormWrapper>
                  <FormContext.Provider value={{
                    name: makeName(name, 'yes'),
                    value: yes[1],
                    onChange: v => handleChange([false, v]),
                  }}>
                    {ifNoNode}
                  </FormContext.Provider>
                </NestedFormWrapper>
              )}

              {yesValue && (
                <NestedFormWrapper>
                  <FormContext.Provider value={{
                    name: makeName(name, 'no'),
                    value: yes[1],
                    onChange: v => handleChange([true, v]),
                  }}>
                    {ifYesNode}
                  </FormContext.Provider>
                </NestedFormWrapper>
              )}
            </Fragment>
          )
        }}
      </FormContext.Consumer>
    </InputWrapper>
  );
};

YesNoInput.defaultValue = { progress: 0 };

export default YesNoInput;
