import React, {useEffect, useState} from 'react';
import {H1, H3, Paragraph} from "../../sections/Questionnaire/QuestionnaireStartPage";
import {GlobalStyles} from "../../pages/Questionnaire";
import Spacer from "../Spacer";
import styled from "styled-components";
import Button from "../Button";
import MaterialButton from '@material-ui/core/Button';
import {ClipLoader} from "react-spinners";
import get from 'lodash/get';
import { useMutation } from 'react-apollo-hooks'
import {requestAuthenticationCode, verifyAuthenticationCode} from "../../graphql/schema/questionnaire";

const TokenInput = styled.input.attrs({ type: 'text' })`
  min-height: 3em;
  font-size: 1.5em;
  font-weight: 500;
  background: rgba(0, 12, 63, 0.05);
  min-width: 0;
  border: none;
  text-align: center;
  border-bottom: 2px solid #000C3F;
  color: #000C3F;
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

`;

const Box = styled.div`
  display: flex:
  flex-direction: column;
  align-self: center;
`;

const errorCodes = {
  EXPIRED: 'EXPIRED',
  INVALID: 'INVALID',
  ATTEMPTS: 'ATTEMPTS',
  FAILED_SENDING: 'FAILED_SENDING',
  UNEXPECTED: 'UNEXPECTED'
};

const errorLabels = {
  [errorCodes.EXPIRED]: 'Code expired, click here to send a new one',
  [errorCodes.INVALID]: 'Entered code is not valid. Please try again.',
  [errorCodes.ATTEMPTS]: 'Too many attempts. Please wait few minutes and try again.',
  [errorCodes.FAILED_SENDING]: 'Failed sending code. Please Try again.',
  [errorCodes.UNEXPECTED]: 'Unexpected error occurred. Please try again later.',
};

const getErrorLabel = key => {
  if(key in errorLabels) {
    return errorLabels[key];
  } else {
    return errorLabels[errorCodes.UNEXPECTED];
  }
};

const PendingVerification = ({working, disabled, onSubmit, code, onCodeChange}) => {
  return (
    <Box>
      <form onSubmit={e => {e.preventDefault(); e.stopPropagation();}}>
        <TokenInput disabled={disabled} onChange={e => onCodeChange(e.target.value)} value={code}/>
        <Spacer size={1} />
        <Button
          label={working ? <ClipLoader color={'white'} size={0.7} sizeUnit={'em'}/> : "Verify"}
          disabled={disabled || (!code || code.length === 0)}
          onClick={() => onSubmit(code)}
        />
      </form>
    </Box>
  )
};

const VerificationError = ({error, onResend, working, shouldResend}) => (
  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    <Paragraph style={{ color: '#E11B1B', fontWeight: 500 }}>{getErrorLabel(error)}</Paragraph>
    {shouldResend && <MaterialButton variant="outlined" size="small" style={{marginLeft: '1em'}} onClick={onResend} disabled={working}>Resend Code</MaterialButton>}
  </div>
);

const CodeSentNotice = ({numbers}) =>(
  numbers ? <Paragraph>{`A text message with secret code has been sent to your mobile phone: ${numbers.map(number => number)}`}</Paragraph> : null
);

const TokenAuthentication = ({onVerified}) => {
  const [working, setWorking] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [numbers, setNumbers] = useState(null);

  const requestCode = useMutation(requestAuthenticationCode);
  const verifyCode = useMutation(verifyAuthenticationCode);

  const shouldResend = [errorCodes.EXPIRED, errorCodes.FAILED_SENDING, errorCodes.ATTEMPTS].includes(error);

  const submitToken = async (token) => {
    try {
      setWorking(true);
      const result = await verifyCode({variables: {token}});
      setError(null);
      onVerified(get(result, 'data.verifyAuthenticationCode'));
    } catch (e) {
      if(get(e, 'message', '').indexOf('Code Invalid') > 0) {
        setError(errorCodes.INVALID);
      } else if(get(e, 'message', '').indexOf('Code Expired') > 0) {
        setError(errorCodes.EXPIRED);
      } else if(get(e, 'message', '').indexOf('Too Many Attempts') > 0) {
        setError(errorCodes.ATTEMPTS);
      } else {
        setError(errorCodes.UNEXPECTED);
      }
      setWorking(false);
    }
  };

  const resendCode = async () => {
    setWorking(true);
    try {
      const result = await requestCode();
      if(get(result, 'data.requestAuthenticationCode.status') === 'SKIP') {
        const session = get(result, 'data.requestAuthenticationCode.session');
        if(session && session.token) {
          onVerified(session);
        }
      } else {
        setNumbers(get(result, 'data.requestAuthenticationCode.phoneNumbers', []));
      }

      setError(null);
    } catch (e) {
      console.log(e);
      setError(errorCodes.FAILED_SENDING);
    } finally {
      setWorking(false);
    }
  };

  const init = () => {
    resendCode();
  };

  useEffect(init, []);

  return (
    <div className='Page PageCenter' style={{ textAlign: 'center' }}>
      <GlobalStyles />
      <i className='material-icons' style={{fontSize: '3.2rem'}}>lock</i>
      <Spacer size={1}/>
      <H1>Two Step Verification</H1>
      <H3>In order to keep your data safe we need to verify your identity.</H3>
      <H3>Thank you for your understanding!</H3>
      <div style={{padding: '0 0 1.5em 0'}}>
      {error ? <VerificationError error={error} onResend={resendCode} working={working} shouldResend={shouldResend}/> : <CodeSentNotice numbers={numbers}/>}
      </div>
      <PendingVerification working={working} disabled={working || shouldResend} onSubmit={submitToken} error={error} code={code} onCodeChange={setCode}/>
    </div>
  );
};

export default TokenAuthentication;
