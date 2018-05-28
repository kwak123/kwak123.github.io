import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ component, href }) => (
  <a href={href}>
    {component}
  </a>
);

Icon.propTypes = {
  component: PropTypes.instanceOf(Object).isRequired,
  href: PropTypes.string,
};

Icon.defaultProps = {
  href: '',
};

export default Icon;
