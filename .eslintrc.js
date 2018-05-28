module.exports = {
  extends: 'airbnb',
  settings: {
    'import/core-modules': [
      'react',
      'prop-types',
      'react-helmet',
      'styled-components',
    ],
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'object-curly-newline': ['error', {
      ObjectPattern: {
        multiline: true,
        minProperties: 5,
      },
      ObjectExpression: {
        multiline: true,
        minProperties: 1,
      },
    }]
  },
  globals: {
    graphql: true,
  }
};
