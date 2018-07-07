import React from 'react';

import EmailIcon from './email.icon.svg';
import GitHubIcon from './github.icon.svg';
import LinkedInIcon from './linkedin.icon.svg';

const icons = [
  {
    component: <EmailIcon />,
    href: 'mailto:kwak123@gmail.com',
    text: 'kwak123@gmail',
    fill: '#c71610',
  },
  {
    component: <GitHubIcon />,
    href: 'https://github.com/kwak123',
    text: 'github/kwak123',
    fill: 'black',
  },
  {
    component: <LinkedInIcon />,
    href: 'https://linkedin.com/in/kwak123',
    text: 'linkedin/kwak123',
    fill: '#0077b5',
  },
];

export default icons;
