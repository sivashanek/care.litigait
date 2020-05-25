import styled from 'styled-components'

export default styled.div`
  display: block;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 1em;
  height: 2em;
  width: 2em;
  margin-right: .5em;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: rgba(0, 12, 63, 0.05);
  
  span {
    border: .125em solid #000C3F;
  }
  
  &:hover input ~ span {
    background-color: transparent;
  }
  
  input:checked ~ span {
    // background-color: #2196F3;
  }
  
  input:focus ~ span {
    border-color: rgb(0, 167, 247);
  }
  
  input:checked ~ span:after {
    display: block;
  }
  
  span:after {
    left: 0;
    right: 0;
    top: -.25em;
    bottom: 0;
    margin: auto;
    width: 6px;
    height: 11px;
    border: solid #000C3F;
    border-width: 0 .125em .125em 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`
