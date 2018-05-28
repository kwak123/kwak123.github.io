import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from './icon';
import icons from '../assets/icons';

const Container = styled.div`
  background: darkgray;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
`;

const Content = styled.div`
  font-size: 1rem;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Footer = () => (
  <Container>
    <Inner>
      <Content>
        Full-stack developer at Big Nerd Ranch
      </Content>
      <IconsContainer>
        {icons.map(({ component, href }) =>
          <Icon href={href} component={component} key={href} />)}
      </IconsContainer>
    </Inner>
  </Container>
);

export default Footer;
