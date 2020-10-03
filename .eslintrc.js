module.exports = {
  extends: ['plugin:@ejhammond/react'],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    { files: ['*rc.js', '*.config.js'], extends: ['plugin:@ejhammond/node'] },
    { files: ['gatsby-config.js', 'gatsby-node.js'], extends: ['plugin:@ejhammond/node'] },
    {
      files: ['gatsby-config.js'],
      rules: {
        '@typescript-eslint/camelcase': 'off',
      },
    },
  ],
};
