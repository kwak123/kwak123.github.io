import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { baseFont } from '../utils/css';

const Icon = ({ component, href, fill, text }) => {
  const IconAnchor = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    filter: opacity(0.6);
    transition: 0.5s;
    fill: gray;
    margin: 12px;
    font-family: ${baseFont};
    text-decoration: none;

    &:hover {
      filter: opacity(1);
      transition: 0.5s;
      fill: ${fill}
    }
    
    & svg {
      margin-right: 8px;
    }
  `;

  return (
    <IconAnchor href={href}>
      {component}
      {text}
    </IconAnchor>
  );
};

Icon.propTypes = {
  component: PropTypes.instanceOf(Object).isRequired,
  href: PropTypes.string,
  fill: PropTypes.string,
  text: PropTypes.string,
};

Icon.defaultProps = {
  href: '',
  fill: '',
  text: '',
};

export default Icon;
