import React from 'react';
import styled from 'styled-components';
import './Button.css';

const Button = ({ label, onClick, disabled, style, type }) => (
  <button onClick={onClick} className='Button' disabled={disabled} style={style} type={type}>
    {label}
  </button>
);

const HtmlButton = styled.button`
  text-align: center;
  position: relative;
  display: inline-block;
  font-family: Rubik, -apple-system, "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", sans-serif;
  font-size: 1.8em;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
  border: none;
  line-height: 1;
  outline: none;
  background: #00a7f7;
  color: #fff;
  border-radius: 4px;
  padding: 0.75em 1.25em;
  transition: all 0.1s ease;

  &:hover {
    cursor: pointer;
    background: #003569;
  }

  &:active {
    background-color: #323465;
  }

  :disabled,
  &[disabled] {
    opacity: 0.7;
    cursor: default;
    pointer-events: none;
  }
`;


export const ButtonLink = HtmlButton.withComponent('a');

export default Button;
