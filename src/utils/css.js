import { css } from 'styled-components';

/* Pass in sizes object from config */
const mediaQuery = ({ mini, palm, laptop, desktop }) => {
  const sizes = [mini, palm, laptop, desktop];
  return sizes.reduce((acc, size) => {
    acc[size] = (...args) => css`
      @media (max-width: ${sizes[size] / 16}em) {
        ${css(...args)}
      }
    `;
    return acc;
  });
};

export default {
  mediaQuery,
};
