import React, { useMemo, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import get from 'lodash/fp/get';
import { questionnaireAnswers, myQuestionnaireAnswers, submitQuestionnaireAnswers, editQuestionnaireAnswers } from '../graphql/schema/questionnaire'
import './pages.css'
import ErrorBox from '../components/ErrorBox'
import logo from '../assets/images/ospitek_logo.png'
import { useMutation, useQuery } from 'react-apollo-hooks'
import Unauthorized from './Unauthorized'
import renderFormNode from '../components/Questionnaire/renderFormNode'
import FormContext from '../components/Questionnaire/FormContext'
import QuestionnaireSuccessState from '../sections/Questionnaire/QuestionnaireSuccessState'
import QuestionnaireStartPage from "../sections/Questionnaire/QuestionnaireStartPage";
import withAuthentication from "../components/authentication/withAuthentication";

export const GlobalStyles = createGlobalStyle`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      /* display: none; <- Crashes Chrome on hover */
      -webkit-appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }

  body {
    background-color: white;
    color: #000C3F;
  }

  input[type=number] {
      -moz-appearance:textfield; /* Firefox */
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  min-width: 0;
  min-width: 100%;
`;

const Footer = styled.div`
  margin-top: auto;
  text-align: center;
  padding-top: 1rem;
`;

const Logo = styled.img`
  max-height: .875rem;
`;

const Form = styled.div`
  font-size: 1rem;
`;

const ProgressBarWrapper = styled.div`
  position: fixed;
  max-width: 620px;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 12, 63, 0.15);
  padding: 1em;
  z-index: 10;
  display: flex;

  @media only screen and (max-width: 1200px) {
    max-width: initial;
  }
`;

const ProgressBarInner = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  height: 1em;
  border-radius: 2em;
  overflow: hidden;
`;

const ProgressBarBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 12, 63, .1);
`;

const ProgressBar = styled.div`
  position: absolute;
  left: 0;
  width: ${props => Math.ceil(props.width)}%;
  height: 100%;
  background: #1BD588;
  transition: width .3s ease-in-out;
`;

const ProgressText = styled.div`
  font-size: .875em;
  font-weight: 500;
  opacity: .5;
  white-space: nowrap;
  margin-left: 1em;
`;

const Questionnaire = ({ id, questions, answers, useQuestionnaireMutation }) => {
  const originalAnswers = JSON.parse(answers);
  const [error, setError] = useState();
  const [busy, setBusy] = useState(false);
  const [value, onChange] = useState(originalAnswers);
  const [completed, setCompleted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const [formFields, formWeight] = useMemo(() => {
    const rootNode = JSON.parse(questions);
    return [renderFormNode(rootNode), rootNode.weight];
  }, [questions]);

  const submitAnswers = useQuestionnaireMutation();

  const handleSubmit = async () => {
    setBusy(true);
    setError();

    try {
      await submitAnswers({
        variables: {
          id,
          answers: JSON.stringify(value),
        },
      });
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    await handleSubmit();
  };

  const complete = () => {
    setCompleted(true);
  };

  if (showDisclaimer) {
    return <QuestionnaireStartPage onAccept={() => setShowDisclaimer(false)} />
  }

  if (completed) {
    return <QuestionnaireSuccessState onBack={() => setCompleted(false)} />;
  }

  return (
    <div className="Page">
      <GlobalStyles />

      <Wrapper>
        {error &&
          <ErrorBox>
            {'There was an error submitting the form. Please, try again. If the problem persists, contact the help desk staff.'}
          </ErrorBox>
        }

        <ProgressBarWrapper>
          <ProgressBarInner>
            <ProgressBarBase>
            </ProgressBarBase>
            <ProgressBar width={(get('progress')(value) || 0) / formWeight * 100}/>
          </ProgressBarInner>
          <ProgressText>
            {Math.ceil((get('progress')(value) || 0) / formWeight * 100)}%
          </ProgressText>
        </ProgressBarWrapper>

        <Form onSubmit={handleSubmit}>
          <FormContext.Provider value={{ value, onChange, busy, save, complete }}>
            {formFields}
          </FormContext.Provider>
        </Form>

        <Footer>
          <Logo src={logo} />
        </Footer>
      </Wrapper>
    </div>
  );
};

const MyQuestionnaire = ({ id, selectData, useQuestionnaireQuery, useQuestionnaireMutation, onExpired }) => {
  const { loading, error, data } = useQuestionnaireQuery();

  if ((get('message')(error) || '').indexOf('Unauthorized') > 0) {
    onExpired && onExpired();
    return null;
  }

  if (loading) {
    return null;
  }

  if (error && error.message === 'GraphQL error: Selected entity does not exist') {
    return <Unauthorized />;
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  const { questions, answers } = selectData(data);

  return (
    <Questionnaire
      id={id}
      questions={questions}
      answers={answers}
      useQuestionnaireMutation={useQuestionnaireMutation}
    />
  );
};

const AdminQuestionnaire = MyQuestionnaire;

const PatientQuestionnaire = withAuthentication(MyQuestionnaire);

export default ({ match }) => {
  const id = get('params.id')(match);

  if (id) {
    const selectData = get('questionnaireAnswers');
    const useQuestionnaireQuery = () => useQuery(questionnaireAnswers, {
      variables: {
        id: parseInt(id, 10),
      },
    });

    const useQuestionnaireMutation = () => useMutation(editQuestionnaireAnswers, {
      refetchQueries: [{ query: questionnaireAnswers, variables: {id: parseInt(id, 10)}, skip: !id }],
    });

    return (
      <AdminQuestionnaire
        id={parseInt(id, 10)}
        selectData={selectData}
        useQuestionnaireQuery={useQuestionnaireQuery}
        useQuestionnaireMutation={useQuestionnaireMutation}
      />
    );
  } else {
    const selectData = get('myQuestionnaireAnswers');
    const useQuestionnaireQuery = () => useQuery(myQuestionnaireAnswers);
    const useQuestionnaireMutation = () => useMutation(submitQuestionnaireAnswers, {
      refetchQueries: [{ query: myQuestionnaireAnswers }]
    });

    return (
      <PatientQuestionnaire
        selectData={selectData}
        useQuestionnaireQuery={useQuestionnaireQuery}
        useQuestionnaireMutation={useQuestionnaireMutation}
      />
    );
  }
}
