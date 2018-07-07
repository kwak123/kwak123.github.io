import React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components';

import { mediaQuery, baseFont } from '../utils/css';
import ProfilePic from '../assets/images/personal.jpg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${baseFont};
`;

const Title = styled.h1`
  text-decoration: underline lightgray;
`;

const ProfilePicture = styled.img`
  border-radius: 100%;
  box-shadow: 0 4px 8px lightgray;
`;

const Content = styled.div`
  display: flex;

  ${mediaQuery.palm`
    flex-direction: column
  `}
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
`;

const IndexPage = () => (
  <Container>
    <Title>About me</Title>
    <Content>
      <ProfilePicture src={ProfilePic} alt="profile-pic" />
      <Description>
        <h3>Hey! I&apos;m Samuel Kwak</h3>
        <p>
          Biochemistry Graduate, now poking around in the tech space.
          I love the mobile environment (well, Android), but I spend most of my time with JS.
          You can catch me in the mountains or in the kitchen.
        </p>
      </Description>
    </Content>
    <Link to="/page-2/">Go to page 2</Link>
  </Container>
);

export default IndexPage;
