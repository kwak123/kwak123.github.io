import React from 'react';
import styled from 'styled-components';

import Icon from './icon';
import icons from '../assets/icons';

const Container = styled.div`
  background: #f5f5f5;
`;

const Inner = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem .8rem;
`;

const Content = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: center;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Footer = () => (
  <Container>
    <Inner>
      <Content>
        Full-stack developer at Big Nerd Ranch.<br />
        Mostly JavaScript, dabble in Android.<br />
        My objective? Observe, question, form hypothesis, experiment, analyze, repeat.<br />
        And write clean code.
      </Content>
      <IconsContainer>
        {icons.map(icon => <Icon key={icon.href} {...icon} />)}
      </IconsContainer>
    </Inner>
  </Container>
);

export default Footer;
