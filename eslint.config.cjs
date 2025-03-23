const eslintPluginAstro = require("eslint-plugin-astro");
const eslintPluginJsxA11y = require("eslint-plugin-jsx-a11y");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  { ignores: ["data/", ".astro/", "build/", "dist/", "node_modules/"] },
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    plugins: {
      "jsx-a11y": eslintPluginJsxA11y,
    },
    rules: {
      ...eslintPluginJsxA11y.configs.strict.rules,
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...typescriptEslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    files: ["**/*.astro"],
    languageOptions: {
      globals: {
        Astro: "readonly",
        Fragment: "readonly",
      },
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      astro: eslintPluginAstro,
      "@typescript-eslint": typescriptEslint,
    },
    processor: "astro/client-side-ts",
    rules: {
      ...eslintPluginAstro.configs["flat/recommended"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
