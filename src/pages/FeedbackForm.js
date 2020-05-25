import React, {Fragment, useState} from 'react';
import {graphql, Mutation} from 'react-apollo';
import useMap from 'use-object';
import {myFeedback, submitFeedback} from '../graphql/schema/rating';
import styled from "styled-components";
import RatingWidget from '../sections/FeedbackForm/RatingWidget';
import './pages.css';
import TextBox from '../components/TextBox';
import Spacer from '../components/Spacer';
import Button, {ButtonLink} from '../components/Button';
import FeedbackSuccessState from '../sections/FeedbackForm/FeedbackSuccessState';
import ErrorBox from '../components/ErrorBox';
import Unauthorized from './Unauthorized';
import logo from '../assets/images/ospitek_logo.png';
import {H3} from "../sections/Questionnaire/QuestionnaireStartPage";
import get from 'lodash/get';

const defaultValue = { rating: undefined, suggestion: undefined, error: false };

const Header = styled.div`
  margin-bottom: auto;
  text-align: center;
  font-size: 1.125rem;
  opacity: .5;
`;

const RatingForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Footer = styled.div`
  margin-top: auto;
  text-align: center;
  padding-top: 1rem;
`;

const Logo = styled.img`
  max-height: .875rem;
`;

const FeedbackForm = ({ data = {} }) => {
  const [ { rating, suggestion, error }, { set } ] = useMap(defaultValue);
  const [promptGoogleRating, setPromptGoogleRating] = useState(false);

  if (data && data.loading) {
    return null;
  }

  if (data && data.error && data.error.message === 'GraphQL error: Selected entity does not exist') {
    return <Unauthorized />;
  }

  if (data && data.myFeedback && data.myFeedback.id) {
    return <FeedbackSuccessState />;
  }

  const {name: hospitalName, googleReviewLink} = get(data, 'patientHospital', {});

  const onStarRatingChange = value => {
    set('rating', value);
    if(typeof value === 'number' && value > 4 && googleReviewLink) {
      setPromptGoogleRating(true);
    } else if(promptGoogleRating) {
      setPromptGoogleRating(false);
    }
  };

  const syncFeedback =  mutate => async () => {
    await mutate({ variables: { rating, suggestion: 'Feedback left on Google.' } });
  };

  return (
    <Fragment>
      <Mutation
        mutation={submitFeedback}
        refetchQueries={[{ query: myFeedback }]}
        onError={() => set('error', true)}
      >
        {mutate =>
          <div className='Page' style={{justifyContent: 'center'}}>
            <RatingForm onSubmit={(e) => {
              e.preventDefault();
              mutate({ variables: { rating, suggestion } });
            }}>
              {error &&
                <ErrorBox>
                  {'There was an error submitting the form. Please, try again. If the problem persists, contact the help desk staff.'}
                </ErrorBox>
              }

              {hospitalName ? <Header>{hospitalName}</Header> : null}

              <RatingWidget
                rating={rating}
                onChange={onStarRatingChange}
              />
              <Spacer size={3} />
              {promptGoogleRating ?
                <Fragment>
                  <H3 style={{marginBottom: '3em', fontSize: '1.2rem'}}>Thank you! Would You take a second and rate us on Google?</H3>
                  <ButtonLink style={{marginBottom: '0.5em'}} href={googleReviewLink} target='_blank' onClick={syncFeedback(mutate)}>Yes</ButtonLink>
                  <Button style={{backgroundColor: '#435182', borderColor: '#435182'}} label='No' onClick={(e) => {e.preventDefault(); setPromptGoogleRating(false)}} type="button" />
                </Fragment> :
                <Fragment>
                  <TextBox
                    name='suggestion'
                    label='Would you like to leave a comment or tell us how we could have improved your experience?'
                    value={suggestion}
                    onChange={(e) => set('suggestion', e.target.value)}
                  />
                  <Spacer size={3} />

                  <Button
                    disabled={typeof rating !== 'number'}
                    label='Send Feedback'
                  />
                </Fragment>}
              <Footer>
                <Logo src={logo} />
              </Footer>
            </RatingForm>
          </div>
        }
      </Mutation>
    </Fragment>
  );
};

export default graphql(myFeedback)(FeedbackForm);
