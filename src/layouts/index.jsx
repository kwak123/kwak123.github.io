import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from 'styled-components';

import Header from '../components/header';
import Footer from '../components/footer';
import './normalize.css';
import favicon from '../assets/favicon/favicon.ico';

import { baseFont } from '../utils/css';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: ${baseFont};
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 0px 1.0875rem 1.45rem;
  padding-top: 0;
`;


const Layout = ({ children, data }) => (
  <Container>
    <Helmet
      title={data.site.siteMetadata.title}
      link={data.site.siteMetadata.link}
      meta={data.site.siteMetadata.meta}
      favicon={favicon}
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
