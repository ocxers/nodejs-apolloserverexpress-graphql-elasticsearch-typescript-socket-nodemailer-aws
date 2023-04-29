module.exports = {
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:node/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "node/no-extraneous-require": 0,
    "node/no-extraneous-import": 0,
    "node/no-missing-require": 0,
    "node/no-missing-import": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-var-require": 0,
    "node/no-unsupported-features/es-syntax": [
      "error",
      {
        ignores: ["modules"],
      },
    ],
    "no-console": 1,
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    camelcase: [
      0,
      {
        ignoreGlobals: true,
      },
    ],
    quotes: [
      1,
      "single",
      {
        allowTemplateLiterals: true,
      },
    ],
    semi: [1, "never"],
    "no-empty-function": 1,
    "space-before-function-paren": 1,
    "object-curly-spacing": [1, "always"],
    "comma-dangle": 1,
    indent: [1, 2],
    "@typescript-eslint/no-empty-function": 1,
    "max-len": [1, 120],
    "no-multiple-empty-lines": 1,
    "no-multi-spaces": 1,
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/class-name-casing": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  overrides: [
    {
      files: [".eslintrc.js", "*.config.js"],
      parserOptions: { sourceType: "script" },
      env: { node: true },
    },
  ],
};
