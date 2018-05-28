import React from 'react';

import EmailIcon from './email.icon.svg';
import GitHubIcon from './github.icon.svg';
import LinkedInIcon from './linkedin.icon.svg';

const icons = [
  {
    component: <EmailIcon />,
    href: 'mailto:kwak123@gmail.com',
  },
  {
    component: <GitHubIcon />,
    href: 'https://github.com/kwak123',
  },
  {
    component: <LinkedInIcon />,
    href: 'https://linkedin.com/in/kwak123',
  },
];

export default icons;
