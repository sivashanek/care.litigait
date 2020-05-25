import React from 'react';
import styled from 'styled-components';
import { GlobalStyles } from '../../pages/Questionnaire'
import { Action, Actions, H2, Header, Paragraph } from "./QuestionnaireStartPage"
import { hospital } from "../../graphql/schema/familyMember"
import get from "lodash/get"
import { getGMapsLink } from "../PatientStatus/HospitalInformation"
import { Query } from "react-apollo"
import { ButtonBack, ButtonBar } from "../../components/Questionnaire/inputs/SectionsInput"
import Icon from "@material-ui/core/Icon"

export const Success = styled.div`
  background: #1BD588;
  border-radius: 1em;
  padding: 1.5em;
  color: #004428;
  width: 5em;
  height: 5em;
  display: flex;
  lex: 1 0 auto;
  margin: auto;

  justify-content: center;
  align-items: center;

  margin-bottom: 2em;

  span {
    color: white;
    font-size: 6em;
    font-weight: 900;
  }
`;

export default ({ onBack }) => (
  <Query query={hospital}>
    {({ data: { patientHospital: hospital } }) => (
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
        </Header>

        <div>
          <Success>
            <Icon>check</Icon>
          </Success>
          <H2 style={{ margin: 0 }}>Thank you!</H2>
          <Paragraph lead>The questionnaire was submitted successfully. A staff member or nurse may call you for further clarification.</Paragraph>
          <hr style={{ borderTop: '1px solid rgba(0, 12, 63, .15)', borderBottom: 'none' }}/>
        </div>
        <ButtonBar>
          <ButtonBack style={{ fontSize: '1rem' }} onClick={onBack}>Go Back to Form</ButtonBack>
        </ButtonBar>
      </div>)}
  </Query>
);
