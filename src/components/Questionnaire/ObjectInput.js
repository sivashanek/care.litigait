import React from 'react';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import isObject from 'lodash/isObject';
import FormContext from './FormContext';
import renderFormNode from './renderFormNode';
import makeName from './makeName'

const ObjectInput = ({ schema, ...props }) => (
  <FormContext.Consumer>
    {({ name, value, onChange }) => (
      schema.map(([key, node]) => {
        const handleChange = v => {
          const nextValue = set(isObject(value) ? cloneDeep(value): {}, ['schema', key], v);
          const progress = Object.values(nextValue.schema).reduce((a, b) => a + get(b, 'progress', 0), 0);
          onChange(set(nextValue, 'progress', progress));
        };

        return (
          <FormContext.Provider key={key} value={{
            name: makeName(name, key),
            value: get(value, ['schema', key]),
            onChange: handleChange,
          }}>
            {renderFormNode(node, {
              key,
              ...props,
            })}
          </FormContext.Provider>
        )
      })
    )}
  </FormContext.Consumer>
);

ObjectInput.defaultValue = { schema: {}, progress: 0 };

export default ObjectInput;
