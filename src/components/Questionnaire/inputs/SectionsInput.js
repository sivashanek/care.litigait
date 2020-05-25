import React, { useContext, useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components'
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import isObject from 'lodash/isObject';
import FormContext from '../FormContext';
import renderFormNode from '../renderFormNode';
import makeName from '../makeName'
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import '../../Button.css';

const LayoutControl = styled.div`
  padding-top: 3em;
  display: flex;
`;

export const Heading = styled.h2`
  margin-bottom: 1.25em;
  font-weight: 100;

  @media only screen and (max-width: 992px) {
    border: none;
    padding-top: 0;
    margin-top: .25em;
  }
`;

export const ButtonBar = styled.div`
  display: flex;
`;

const Button = styled.button`
  background: #00a7f7;
  border: 1px solid #00a7f7;
  border-radius: 4px;
  font-family: Rubik, -apple-system, "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", sans-serif;
  width: 100%;
  font-size: 1em;
  color: #fff;
  padding: 0.5em;
  text-align: center;
  cursor: pointer;
  transition: 160ms all;
  margin-left: .5em;

  &:hover {
    background: #003569;
    border: 1px solid #003569;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ButtonBack = styled(Button)`
  background: rgba(0,12,63,.15);
  color: rgb(0,12,63);
  margin-right: .5em;
  margin-left: 0;
  border-color: transparent;

  &:hover {
    background: rgba(0,12,63,.05);
    border-color: transparent;
  }
`;

const Section = styled.div`
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
  padding: .5em 0;

  span {
    opacity: ${props => props.done ? '1' : '.5'};
    margin-top: .125em;
    margin-left: .75em;
    cursor: pointer;
  }
`;

const SectionCheck = styled.div`
  width: 1.5em;
  height: 1.5em;
  border-radius: 3em;
  border: 1px solid rgba(0, 12, 63, .15);
  position: relative;
  flex-shrink: 0;

  ${props => props.done && css`
    background: #1BD588;
    border-color: transparent;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: -.25em;
      bottom: 0;
      margin: auto;
      width: 5px;
      height: 10px;
      border: solid #fff;
      border-width: 0 .125em .125em 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  `}
`;

const SectionsNavigation = styled.ul`
  list-style-type: none;
  position: fixed;
  top: 4em;
  max-width: 22vw;

  @media only screen and (max-width: 1400px) {
    max-width: 16vw;
  }

  @media only screen and (max-width: 1200px) {
    padding: 0;
    max-width: 32vw;
  }

  @media only screen and (max-width: 1100px) {
    padding: 0;
    max-width: 26vw;
  }

  @media (max-width: 992px) {
    padding: 0;
    max-width: 100%;
  }
`;

const SectionsNavigationItem = styled.li`
  @media only screen and (max-width: 992px) {
    margin: 0 1.5em;
  }
`;

const SectionsNavigationToggle = styled.button`
  display: none;
  width: 5em;
  height: 5em;
  border-radius: 5em;
  background-color: #00a7f7;
  box-shadow: 0 4px 6px rgba(0, 12, 63, 0.1);
  z-index: 11;
  border: 2px solid rgba(0, 12, 63, .15);
  outline: none;

  @media only screen and (max-width: 992px) {
    display: block;
    position: fixed;
    top: 6em;
    right: 2em;
  }
`;

const Form = styled.div`
  flex: 3;
  max-width: 620px;
  padding: 0 1.5em;
  margin: 0 auto;
  overflow: hidden;

  @media only screen and (max-width: 992px) {
    max-width: 100%;
    margin: initial;
    overflow: hidden;
    padding: 0;
  }
`;

const SpacingHelper = styled.div`
  flex: 1;

  @media only screen and (max-width: 1200px) {
    flex: 0;
  }
`;

const SectionNavigationWrapper = styled.div`
  list-style-type: none;
  position: -webkit-sticky; /* Safari */
  // position: sticky;
  // top: 0;
  padding: 0;
  display: block;
  flex: 1;

  @media only screen and (max-width: 992px) {
    position: fixed;
    background: white;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 2em;

    opacity: ${props => props.visible ? 1 : 0};
    transition: opacity .3s ease;
    &.hidden {
      display: none;
      opacity: 0;
    }
  }
`;

const SectionsInput = ({ sections, ...props }) => {
  const { name, value, onChange, save, complete } = useContext(FormContext);

  const [currentSection, setCurrentSection] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);

  const [key, { name: sectionName, body: node }] = sections[currentSection];

  const handleChange = v => {
    const nextValue = set(isObject(value) ? cloneDeep(value) : {}, ['sections', key], v);
    const progress = Object.values(nextValue.sections).reduce((a, b) => a + get(b, 'progress', 0), 0);
    onChange(set(nextValue, 'progress', progress));
  };

  const goBack = async () => {
    await save();
    setCurrentSection(currentSection - 1);
    window.scrollTo(0, 0);
  };

  const finish = async () => {
    await save();
    complete()
  };

  const proceed = async () => {
    await save();
    setCurrentSection(currentSection + 1);
    window.scrollTo(0, 0);
  };

  const onNavigationClick = (i) => {
    setCurrentSection(i);
    setShowNavigation(false);
  };

  const ref = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if(ref.current) {
        if(!showNavigation) {
          ref.current.classList.add('hidden');
        } else {
          ref.current.classList.remove('hidden');
        }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [showNavigation]);

  return (
    <LayoutControl>

      <SectionNavigationWrapper visible={showNavigation} ref={ref}>
        <SectionsNavigation>
          {sections.map(([key, { name, body: node }], i) => {
            const weight = get(node, 'weight', 0);
            const progress = get(value, ['sections', key, 'progress'], 0);
            const done = progress === weight;
            return (
              <SectionsNavigationItem key={key} style={{ padding: 0 }} className={'hidden'}>
                <Section done={done}>
                  <SectionCheck done={done}/>
                  <span onClick={() => onNavigationClick(i)}>{name}</span>
                </Section>
              </SectionsNavigationItem>
            )
          })}
        </SectionsNavigation>
      </SectionNavigationWrapper>

      <Form>
        <Heading>{sectionName}</Heading>
        <FormContext.Provider value={{
          name: makeName(name, key),
          value: get(value, ['sections', key]),
          onChange: handleChange,
        }}>
          {renderFormNode(node, {
            key,
            section: key,
            ...props,
          })}
        </FormContext.Provider>

        <ButtonBar>
          {currentSection > 0 && (
            <ButtonBack onClick={goBack}>Back</ButtonBack>
          )}

          {currentSection >= sections.length - 1 ? (
            <Button onClick={finish}>Save & Finish</Button>
          ) : (
            <Button onClick={proceed}>Save & Continue</Button>
          )}
        </ButtonBar>

        <SectionsNavigationToggle onClick={() => setShowNavigation(!showNavigation)}>
          {showNavigation ? <CloseIcon style={{ color: 'white', backgroundColor: '#00a7f7' }} /> : <MenuIcon style={{ color: 'white', backgroundColor: '#00a7f7' }} />}

        </SectionsNavigationToggle>
      </Form>
      <SpacingHelper />
    </LayoutControl>
  );
};

SectionsInput.defaultValue = { sections: {}, progress: 0 };

export default SectionsInput;
