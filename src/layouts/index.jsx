import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from '../components/header';
import Footer from '../components/footer';
import './normalize.css';

import favicon16 from '../assets/favicon/favicon-16x16.png';
import favicon32 from '../assets/favicon/favicon-32x32.png';

import { baseFont } from '../utils/css';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: ${baseFont};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`;

const faviconLinks = [
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: favicon16,
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: favicon32,
  },
];

const Layout = ({ children, data }) => (
  <Container>
    <Helmet
      title={data.site.siteMetadata.title}
      link={[...(data.site.siteMetadata.link || []), ...faviconLinks]}
      meta={data.site.siteMetadata.meta}
    />
    <Header siteTitle={data.site.siteMetadata.title} />
    <Content>
      {children()}
    </Content>
    <Footer />
  </Container>
);

Layout.propTypes = {
  children: PropTypes.func,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string,
        meta: PropTypes.arrayOf(PropTypes.shape({
          name: PropTypes.string,
          content: PropTypes.string,
        })),
        link: PropTypes.arrayOf(PropTypes.shape({
          rel: PropTypes.string,
          href: PropTypes.string,
        })),
      }),
    }),
  }),
};

Layout.defaultProps = {
  children: () => {},
  data: {
    site: {
      siteMetadata: {},
      meta: [],
      link: [],
    },
  },
};

export default Layout;

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
        meta {
          name
          content
        }
      }
    }
  }
`;
