import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
`;

const BlogEntryContainer = styled.div`
`;

const BlogEntryTitle = styled.h2`
`;

const BlogLandingPage = ({ data }) => (
  <Container>
    Blog Landing Page
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <BlogEntryContainer key={node.id}>
        <BlogEntryTitle>{node.frontmatter.title}</BlogEntryTitle>
      </BlogEntryContainer>
    ))}
  </Container>
);

BlogLandingPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(PropTypes.shape({
        node: PropTypes.shape({
          id: PropTypes.string,
          frontmatter: PropTypes.shape({
            title: PropTypes.string,
          }),
        }),
      })),
    }),
  }),
};

BlogLandingPage.defaultProps = {
  data: {
    allMarkdownRemark: {
      edges: [],
    },
  },
};

export default BlogLandingPage;

export const query = graphql`
  query FetchBlogsQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
