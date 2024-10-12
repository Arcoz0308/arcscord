import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "lib",
    stylistic: {
      quotes: "double",
      semi: true,
    },
    typescript: true,
    ignores: [
      "docs/*",
      "json_docs/*",
    ],
  },
  {
    rules: {
      "ts/consistent-type-definitions": ["error", "type"],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "no-throw-literal": "off",
      "prefer-promise-reject-errors": "off",
    },
  },
);
