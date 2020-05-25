import styled from 'styled-components'

export default styled.input`
  min-height: 3em;
  font-size: 1em;
  background: rgba(0, 12, 63, 0.05);
  min-width: 0;
  // border-width: 0.125em;
  // border-style: solid;
  // border-color: transparent;
  // border-radius: 0.25em;
  border: none;
  border-bottom: .125em solid #000C3F;
  color: #000C3F;
  padding-left: .5em;
  padding-right: .5em;
  transition: border-color 0.2s ease-in-out;
  font-family: inherit;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
    opacity: 0.5;
  }

  &:focus {
    border-color: rgba(0, 167, 247, 0.75);
    outline: none;
  }

  :disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  &[type='number'] {
    width: 100%;
  }
`
