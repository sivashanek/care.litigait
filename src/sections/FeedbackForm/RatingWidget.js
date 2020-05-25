import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import './RatingWidget.css';
import styled from "styled-components";

const Title = styled.h1`
  text-align: center;
`;

const Star = styled.span`
  color: ${props => props.selected ? 'orange' : 'rgba(255, 255, 255, .25)'};
`;

const RatingButton = ({ selected, onClick }) =>
  <button className='RatingButton' onClick={onClick} type='button'>
    <Star className='material-icons' selected={selected}>{selected ? 'star' : 'star_border'}</Star>
  </button>;

RatingButton.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const options = [1, 2, 3, 4, 5];

const RatingWidget = ({ rating, onChange }) => {
  return (
    <Fragment>
      <Title>Rate Your Experience</Title>
      <div className='RatingButtonGroup'>
        {options.map(option =>
          <RatingButton
            key={option}
            selected={rating >= option}
            onClick={() => onChange(option)}
          />
        )}
      </div>
    </Fragment>
  );
};

export default RatingWidget;
