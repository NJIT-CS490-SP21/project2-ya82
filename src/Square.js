import React from 'react';
import PropTypes from 'prop-types';
import './Board.css';

export default function RenderSquare({ clickHandler, letter }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={clickHandler}
      onKeyPress={clickHandler}
      className="box"
    >
      {letter}
    </div>
  );
}

RenderSquare.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  letter: PropTypes.string,
};

RenderSquare.defaultProps = {
  letter: '',
};
