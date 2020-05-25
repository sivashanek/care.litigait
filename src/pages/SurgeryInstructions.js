import React, { Fragment, useCallback, useMemo } from 'react';
import {graphql, Query} from 'react-apollo';
import './pages.css';
import Unauthorized from './Unauthorized';
import {
  acceptSurgeryInstructions, getPastSurgeryInstructions, getSurgeryInstructions,
} from "../graphql/schema/questionnaire";
import {hospital} from "../graphql/schema/familyMember";
import Icon from "@material-ui/core/Icon"

import styled from 'styled-components';
import {Editable, Slate, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {defaultTo, get} from 'lodash';
import {Action,
  Actions,
  Disclaimer,H1,
  H2, Header,
  Paragraph,
  ParagraphSection,
  PrimaryAction
} from "../sections/Questionnaire/QuestionnaireStartPage";
import Button from "../components/Button";
import {GlobalStyles} from "./Questionnaire";
import {getGMapsLink} from "../sections/PatientStatus/HospitalInformation";
import {useMutation} from "react-apollo-hooks";
import {Checkbox} from "../components/Questionnaire/SingleCheckboxInput";
import {parse, format} from 'date-fns';

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 1.5rem;
  min-height: calc(100% - 3rem);
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  max-width: 620px;
`;

const Separator = styled.div`
  margin: 1em auto;
  width: 95%;
  height: 1px;
  opacity: 0.6;
  border-top: 1px solid rgba(0, 12, 63, .15);
  border-bottom: none;
`;

const SuccessMessage = styled.div`
  border-radius: .25em;
`;

const empty = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ParagraphSection><ul {...attributes}>{children}</ul></ParagraphSection>;
    case 'heading-one':
      return <H1 {...attributes}>{children}</H1>;
    case 'heading-two':
      return <H2 {...attributes}>{children}</H2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'separator':
      return (
        <Fragment>
          {children}
          <Separator {...attributes} />
        </Fragment>
      );
    default:
      return <Paragraph {...attributes}>{children}</Paragraph>;
  }
};

const Leaf = ({ attributes, children, leaf, variables }) => {
  if(leaf.variable) {
    const elementText = get(children, 'props.leaf.text', '');
    const [name, element] = elementText
      .replace(/[\s]/gi, '')
      .split('<')
      .map(str => str.replace(/[^\w]/gi, ''));

    const value = variables[name];

    if (element && name) {
      if(element === 'checkbox') {
        children = <Checkbox type="checkbox" checked={value} name={name} disabled={true} style={{cursor: 'unset'}} wrapperStyle={{display: 'inline-flex', transform: 'translateY(0.5em)'}}/>;
      } if(element === 'date') {
        children = <label style={{padding: '0 0.2em', fontWeight: 600}}>{format(parse(value, 'YYYY-MM-DD'), 'D MMMM YYYY')}</label>;
      } else {
        children = <label style={{padding: '0 0.2em', fontWeight: 600}}>{value}</label>;
      }
    } else {
      children = null;
    }
  }

  if (leaf.bold) {
    children = <strong style={{ fontWeight: 600 }}>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em style={{ fontStyle: 'italic' }}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const RichTextViewer = ({ value, variables }) => {
  const renderElement = useCallback(props => <Element {...props} />, []);
  const renderLeaf = useCallback(props => <Leaf {...props} variables={variables}/>, []);
  const editor = useMemo(() => withReact(createEditor()), []);

  return (
    <Slate editor={editor} value={defaultTo(value, empty)} onChange={() => {}}>
        <Editable
          readOnly
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
    </Slate>

  );
};

const Accept = ({accepted, content}) => {
  const accept = useMutation(acceptSurgeryInstructions, {
    refetchQueries: [{ query: getSurgeryInstructions }]
  });

  return (
    accepted ? (
      <SuccessMessage>
        <Paragraph style={{ opacity: .75 }}>
          <Icon style={{ color: '#1BD588', fontSize: '3em' }}>check_box</Icon>
          <div>Thank you! You acknowledged that you have read and accepted these instructions.</div>
        </Paragraph>
      </SuccessMessage>
    ) : (
      <PrimaryAction>
        <Button label={'I agree to follow these instructions'} onClick={() => accept({variables: {content: content}})} disabled={accepted}/>
      </PrimaryAction>
    )
  )
};

const SurgeryInstructions = ({ data = {}, acceptable }) => {
  if (data && data.loading) {
    return null;
  }

  if (data && data.error && data.error.message === 'GraphQL error: Selected entity does not exist') {
    return <Unauthorized />;
  }
  const payload = get(data, 'data.surgeryInstructions', '{}');
  const exchange = defaultTo(JSON.parse(get(data, 'data.myInstructionAcceptance', '[]')), []);
  const {content, variables} = JSON.parse(payload) || {};

  const accepted = !!exchange.find((submission) => get(submission, 'content') === payload);
  return (
    <Query query={hospital}>
      {({data: {patientHospital: hospital}}) => (
        <Wrapper>
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
            <H1 style={{textAlign: 'center'}}>Day of surgery instructions</H1>
          </Header>

          <Disclaimer>
            <RichTextViewer value={content} variables={variables}/>
          </Disclaimer>

          {content && acceptable && <Accept accepted={accepted} content={payload} />}
        </Wrapper>
        )}
    </Query>
  );
};

export default ({match}) => {
  const id = get(match, 'params.id');
  const version = get(match,'params.version');
  if (id) {
    return (
      <Query query={getPastSurgeryInstructions} variables={{id: parseInt(id, 10), version: version ? parseInt(version, 10) : undefined}}>
        {(data) => <SurgeryInstructions data={data} />}
      </Query>
    );
  } else {
    return (
      <Query query={getSurgeryInstructions}>
        {(data) => <SurgeryInstructions data={data} acceptable/>}
      </Query>
    );
  }
}
graphql(getSurgeryInstructions)(SurgeryInstructions);
