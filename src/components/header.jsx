import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

import { headerFont } from '../utils/css';

const Container = styled.div`
  background: #f5f5f5;
  margin-bottom: 1.45 rem;
`;

const InnerContainer = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${headerFont};
  transition: 0.5s;

  & :hover {
    filter: opacity(0.6);
  }
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;

  & :hover {
    filter: opacity(0.6);
    transition: 0.5s;
  }
`;

const styles = {
  link: {
    textDecoration: 'none',
    marginLeft: 8,
  },
};

const links = [
  {
    to: '/blog',
    text: 'Blog',
  },
  {
    to: '/',
    text: 'Home',
  },
];

const Header = () => (
  <Container>
    <InnerContainer>
      <Title>
        <Link to="/" style={styles.link}>SK</Link>
      </Title>
      <LinksContainer>
        {links.map(({ to, text }) =>
          <Link to={to} style={styles.link} key={to}>{text}</Link>)}
      </LinksContainer>
    </InnerContainer>
  </Container>
);

export default Header;
