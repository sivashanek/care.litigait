import styled from 'styled-components'

export default styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 2em;
  width: 2em;
  // border-radius: .125em;
  background-color: rgba(255,255,255,0.1);
  
  &:after {
    content: "";
    position: absolute;
    display: none;
  }
`
