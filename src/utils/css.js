import { css } from 'styled-components';

/* Pass in sizes object from config */
/**
 * Has 4 available sizes:
 * mini: 400px
 * palm: 600px;
 * laptop: 800px;
 * desktop: 960px;
 */

const sizes = {
  mini: 400,
  palm: 600,
  laptop: 800,
  desktop: 960,
};

const mediaQuery = Object.keys(sizes).reduce((acc, size) => {
  acc[size] = (...args) => css`
    @media (max-width: ${sizes[size]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

const headerFont = 'Work Sans, sans-serif';
const baseFont = 'Montserrat, sans-serif';

export default {
  mediaQuery,
  headerFont,
  baseFont,
};
