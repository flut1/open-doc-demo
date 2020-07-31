module.exports = {
  plugins: ["prettier", "react"],
  rules: {
    "prettier/prettier": "warn",
    "no-restricted-modules": [
      "error",
      {
        paths: [
          {
            name: "fs",
            message: "use fs-extra instead.",
          },
        ],
      },
    ],
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:mdx/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["rollup.config.js", "*.mdx"],
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
  settings: {
    react: {
      version: "16.13.1",
    },
  },
  env: {
    node: true,
    es2017: true,
  },
  root: true,
};
