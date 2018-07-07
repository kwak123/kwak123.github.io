module.exports = {
  siteMetadata: {
    title: 'Samuel Kwak',
    meta: [
      {
        name: 'description',
        content: 'sample',
      },
      {
        name: 'keywords',
        content: 'sample, something',
      },
    ],
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-react-svg',
    'gatsby-plugin-styled-components',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Work Sans',
          'Montserrat',
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
  ],
};
