import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import FormContext from './FormContext';
import renderFormNode from './renderFormNode';
import components from './components';
import makeName from './makeName'

const ButtonCustom = styled.button`
  border: none;
  background-color: rgba(0, 12, 63, .15);
  padding: .5em 1em;
  color: inherit;
  font-size: 1em;
  font-weight: 500;
`;

const UL = styled.ul`
  list-style: none;
  padding: 0;
  
  > li {
    border-bottom: 2px solid rgba(0, 12, 63, .15);
    padding-bottom: 1.75em;
    margin-bottom: 1.75em;
  }
`;

const ListInput = ({ label, item }) => {
  const { name, value, onChange } = useContext(FormContext);

  const list = get(value, 'list', [{ list: [components()[item.type].defaultValue], progress: 0 }]);

  const node = useMemo(() => renderFormNode(item), [item]);

  const add = e => {
    e.preventDefault();
    onChange({ list: [...list, components()[item.type].defaultValue], progress: 0 });
  };

  const remove = index => e => {
    e.preventDefault();
    const nextList = [...list];
    nextList.splice(index, 1);
    onChange({ list: nextList, progress: 0 });
  };

  return (
    <div>
      <UL>
        {list.map((v, i) =>
          <li key={i}>
            <FormContext.Provider value={{
              name: makeName(name, i),
              value: get(value, ['list', i], components()[item.type].defaultValue),
              onChange: v => onChange(set(set(cloneDeep(value || components()[item.type].defaultValue), ['list', i], v), 'progress', 0)),
            }}>
              {node}
            </FormContext.Provider>
            <ButtonCustom onClick={remove(i)}>remove</ButtonCustom>
          </li>
        )}
      </UL>
      <ButtonCustom onClick={add}>Add</ButtonCustom>
    </div>
  );
};

ListInput.defaultValue = undefined;

export default ListInput;
