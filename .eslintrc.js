module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
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
  ],
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/destructuring-assignment": [0, "never"],
    "react/jsx-props-no-spreading": [0, "never"],
    "import/no-named-as-default": [0, "never"],
    "react/forbid-prop-types": [0, "never"],
    "react/require-default-props": [0, "never"],
  },
};
