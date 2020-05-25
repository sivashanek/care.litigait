import React from 'react';
import { GlobalStyles } from '../../pages/Questionnaire'
import Button from "../../components/Button";
import styled from 'styled-components';
import {Query} from "react-apollo";
import {hospital} from "../../graphql/schema/familyMember";
import get from 'lodash/get';
import { getGMapsLink } from "../PatientStatus/HospitalInformation"

export const H1 = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  margin-top: 0px;
  margin-bottom: 0.5em;
`;

export const H3 = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  margin-top: 0px;
  margin-bottom: 0.5em;
`;

export const H2 = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
`;

export const Paragraph = styled.p`
  font-size: ${props => props.lead ? '1.4em' : '1.15em'};
  line-height: 1.5;
  opacity: .65;
`;

export const Disclaimer = styled.div`
  text-align: left;
  flex: 0 1 auto;
  min-height: 0;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, .15);
  border-radius: .25em;
  box-shadow: inset 0 4px 8px rgba(0, 0, 0, .05);
  padding: .5em 1em;
  margin-bottom: 1em;

  @media (min-width: 768px) {
    border: none;
    box-shadow: none;
    padding: 0;
    flex: 0 0 auto;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 3em;

  > * + * {
    margin-left: .75em;
  }
`;

export const Action = styled.a`
  display: flex;
  border: 1px solid #00a7f7;
  border-radius: .25em;
  padding: .5em .75em;
  align-items: center;
  text-decoration: none;
  color: #00a7f7;

  > * + * {
    margin-left: .5em;
  }
`;

export const PrimaryAction = styled.div`
  margin-top: auto;
  margin-bottom: 1em;

  @media (min-width: 768px) {
    margin-top: 1em;
  }
`;

export const ParagraphSection = styled.div`
  font-size: ${props => props.lead ? '1.4em' : '1.15em'};
  line-height: 1.5;
  opacity: .65;
`;

export const Header = styled.div``;

export default ({onAccept}) => (
  <Query query={hospital}>
    {({data: {patientHospital: hospital}}) => (
      <div className='Page Disclaimer'>
        <GlobalStyles/>
        <Header>
          {get(hospital, 'contact') &&
          <H2>{get(hospital, 'name')}</H2>
          }
          <Actions>
            {get(hospital, 'contact') &&
            <Action href={`tel:${get(hospital, 'contact')}`}>
              <span className='material-icons'>phone</span>
              <div>Call</div>
            </Action>
            }
            {get(hospital, 'address') &&
            <Action
              href={getGMapsLink(get(hospital, 'address'))}
              target='_blank'
              rel='noopener noreferrer'
            >
              <span className='material-icons'>directions</span>
              <div>Directions</div>
            </Action>
            }
          </Actions>
          <H1 style={{textAlign: 'center'}}>Welcome To Patient Online Registration</H1>
        </Header>

        <Disclaimer>
          <Paragraph lead>{get(hospital, 'name') ? (get(hospital, 'name') + ' needs') : 'We need'} your health information and medical history in order to
            provide you the best care possible. Please fill out this online questionnaire. It is simple, secure,
            confidential.</Paragraph>
          <hr style={{ borderTop: '1px solid rgba(0, 12, 63, .15)', borderBottom: 'none' }}/>
          <ParagraphSection>Please make sure you have the following information available:
            <ul>
              <li>Names and dosage of each prescription medication you take.</li>
              <li>Names and dosage of each over-the-counter medication you take regularly.</li>
              <li>Allergies you may have and the allergic reaction(s) they cause.</li>
              <li>Previous surgeries, and the year they were performed.</li>
            </ul>
          </ParagraphSection>
          <Paragraph>Upon receiving this information, a staff member or nurse may call you for further
            clarification.</Paragraph>
          <Paragraph>We look forward to providing you with the highest quality medical care and service.</Paragraph>
        </Disclaimer>
        {/*<Spacer size={4}/>*/}
        <PrimaryAction>
          <Button onClick={onAccept} label={'Continue'}/>
        </PrimaryAction>
      </div>)}
  </Query>
)
