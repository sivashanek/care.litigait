import React from 'react'
import { deserialize } from 'react-serialize'
import createComponents from './components'

export default (node, props) => {
  const components = createComponents();

  return props
    ? React.cloneElement(deserialize(node, { components }), props)
    : deserialize(node, { components });
}
