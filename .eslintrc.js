module.exports = {
  plugins: ["prettier", "react"],
  rules: {
    "prettier/prettier": "warn",
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:mdx/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["./rollup.config.js", "*.mdx"],
      parserOptions: {
        sourceType: "module",
      },
    },
    {
      files: ["*.mdx"],
      rules: {
        "no-unused-vars": "off",
      },
      globals: {
        props: "readonly",
      },
    },
  ],
  env: {
    node: true,
    es2017: true,
  },
  root: true,
};
