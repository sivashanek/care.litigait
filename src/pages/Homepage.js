import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import config from '../config'
import { GlobalStyles } from '../pages/Questionnaire'
import { H1 } from "../sections/Questionnaire/QuestionnaireStartPage"
import './pages.css'
import { Wrapper } from "./Questionnaire"
import Icon from "@material-ui/core/Icon"
import ClipLoader from 'react-spinners/ClipLoader'

const CustomWrapper = styled(Wrapper)`
  justify-content: center;
  text-align: center;
`;

const HelperText = styled.p`
  opacity: .5;
  line-height: 1.45;
`;

const CharacterInputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5em -.25em;
`;

const CharacterInput = styled.input.attrs({ type: 'text' })`
  min-height: 3em;
  font-size: 1.5em;
  font-weight: 500;
  background: rgba(0, 12, 63, 0.05);
  min-width: 0;
  border: none;
  text-align: center;
  border-bottom: 2px solid #000C3F;
  margin: 0 .25em;
  color: #000C3F;
  padding-left: .5em;
  padding-right: .5em;
  transition: border-color 0.2s ease-in-out;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
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

  @media (max-width: 725px) {
    font-size: 3vw;
  }
`;

const TitleIcon = styled.div`
  margin-bottom: 1em;

  span {
    font-size: 3em;
    color: #000c3f;
    opacity: .25;
  }
`;

const PinInput = ({ value, onChange, onComplete, disabled }) => {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const current = value.length < refs.length ? refs[value.length].current : undefined;

  useEffect(() => {
    if (current && !disabled) {
      current.focus();
    }
    if (value.length === 8) {
      onComplete(value);
    }
  }, [current, disabled, value, onComplete]);

  const handleFocus = i => () => {
    if (value.length > i) {
      onChange(value.substring(0, i));
    } else if (value.length < i) {
      refs[value.length].current.focus();
    }
  };

  const handleChange = i => e => {
    const nextValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]+/g, '');
    onChange(value + nextValue.slice(0, 8 - value.length));
  };

  const handleKeydown = i => e => {
    const key = e.keyCode || e.charCode;

    if (key === 8 || key === 46) {
      refs[i].current.focus();
      if (value.length > 0) {
        onChange(value.slice(0, i - 1));
      }
    }
  };

  return (
    <CharacterInputWrapper>
      {refs.map((ref, i) =>
        <CharacterInput
          key={i}
          ref={ref}
          autoFocus={i === 0}
          onFocus={handleFocus(i)}
          value={value[i] || ''}
          onChange={handleChange(i)}
          onKeyDown={handleKeydown(i)}
          disabled={disabled}
        />
      )}
    </CharacterInputWrapper>
  );
};

export default ({ history }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState();
  const [busy, setBusy] = useState();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const logIn = async value => {
    setBusy(true);

    try {
      const result = await fetch(`${config.apiURL}/identity/session?pin=${encodeURIComponent(value)}`);

      if (result.ok) {
        history.push(`/questionnaire/${value}`);
      } else {
        setError("PIN is not valid, please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("Unexpected error ocurred, please try again later.");
    } finally {
      setValue('');
      setBusy(false);
    }
  };

  return (
    <div className="Page Disclaimer">
      <CustomWrapper>
        <GlobalStyles />
        <TitleIcon>
          <Icon>lock</Icon>
        </TitleIcon>
        <H1>Please enter your PIN</H1>
        <PinInput value={value} onChange={setValue} onComplete={logIn} disabled={busy} />
        <div style={{ textAlign: 'center' }}>
          {busy && <ClipLoader/>}
          {!busy && <span style={{ color: '#b6a621', fontWeight: 500 }}>{error}</span>}
        </div>
        <HelperText>You can find the PIN in the text message you have received from the surgical center.</HelperText>
      </CustomWrapper>
    </div>
  );
}
