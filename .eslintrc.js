module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 2,
  },
  overrides: [
    {
      files: '**/*.js',
      // disable restricted syntax error
      rules: {
        'no-restricted-syntax': 'off',
        'no-continue': 'off',
      },
    },
    {
      files: '**/__tests__/*.js',
      env: { jest: true },
    },
  ],
}
