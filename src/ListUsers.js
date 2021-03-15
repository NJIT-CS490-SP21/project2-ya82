import React from 'react';
import PropTypes from 'prop-types';

export default function ListUsers({ name }) {
  return <li> {name} </li>;
}

ListUsers.propTypes = {
  name: PropTypes.string,
};

ListUsers.defaultProps = {
  name: '',
};
