module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    // "airbnb",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: [
    "react",
    // "jest-react"
  ],
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
    "semi": [2, "always"],
    "react/prop-types": 0,
    "no-multi-spaces": ["error"],
    "arrow-body-style": ["error", "as-needed"],
    "object-curly-spacing": ["error", "never"],
    "template-curly-spacing": "error",
    curly: ["error", "multi-or-nest"],
  },
};
  