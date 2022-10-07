module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  rules: {},
  ignorePatterns: ["dist/**", "examples/**", ".eslintrc.js"],

  overrides: [
    {
      files: ["src/lib/nodemailer/**"],
      rules: {
        "import/no-extraneous-dependencies": 0,
      },
    },
  ],
};
