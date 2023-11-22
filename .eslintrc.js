module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    project: './tsconfig.json'
  },
  rules: {
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-throw-literal": "warn",
    "import/no-extraneous-dependencies": "warn",
    "no-underscore-dangle": "warn",
    "no-plusplus": "off",
    "prefer-arrow-callback": "off",
    "func-names": "off",
    "implicit-arrow-linebreak": "off",
    "max-len": ["error", { "code": 120 }],
    '@typescript-eslint/quotes': ["error", "double"],
    quotes: ["error", "double"],
    semi: [2, "always"],
    "no-console": "off",
    "import/prefer-default-export": "off",
    "no-await-in-loop": "off",
    "import/no-relative-packages": "off",
    "no-restricted-syntax": ["error", "WithStatement", "LabeledStatement", "ForInStatement", "BinaryExpression[operator='in']"],
  },
};
