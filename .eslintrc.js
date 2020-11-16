module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    // "plugin:prettier/recommended",
    // 'airbnb',
    // 'plugin:import/errors',
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    'react-app'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jest',
    // 'prettier',
  ],
  settings: {
    react:  {
      version:  'detect',
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    indent: [0, 'never'], // prettier is responsible for indent
    semicolon: [0, 'never'],
    'linebreak-style': 0,
    // "prettier/prettier": ["error"],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'no-param-reassign': ["error", { "props": false }],
    // https://stackoverflow.com/a/64024916/4380989
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": true }],
    'react/destructuring-assignment': [0, 'never'],
    'react/jsx-props-no-spreading': [0, 'never'],
    'import/no-named-as-default': [0, 'never'],
    'react/forbid-prop-types': [0, 'never'],
    'react/require-default-props': [0, 'never'],
    'arrow-parens': [0, 'never'],
    // Reenable in the future?
    'import/no-anonymous-default-export': 0,
    'react/jsx-sort-props': [
      1,
      {
        callbacksLast: true,
        shorthandFirst: true,
        reservedFirst: true,
        noSortAlphabetically: true,
      },
    ],
  },
};
