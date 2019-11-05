module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    "plugin:flowtype/recommended",
    // "plugin:prettier/recommended",
    'airbnb',
    'plugin:import/errors',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
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
    'flowtype',
    // 'prettier',
  ],
  settings: {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  rules: {
    indent: [0, 'never'], // prettier is responsible for indent
    semicolon: [0, 'never'],
    // "prettier/prettier": ["error"],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx'] },
    ],
    'react/destructuring-assignment': [0, 'never'],
    'react/jsx-props-no-spreading': [0, 'never'],
    'import/no-named-as-default': [0, 'never'],
    'react/forbid-prop-types': [0, 'never'],
    'react/require-default-props': [0, 'never'],
    'arrow-parens': [0, 'never'],
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
