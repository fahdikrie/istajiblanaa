const eslintPluginAstro = require("eslint-plugin-astro");
const eslintPluginJsxA11y = require("eslint-plugin-jsx-a11y");

module.exports = [
  ...eslintPluginAstro.configs["flat/recommended"],
  {
    plugins: {
      "jsx-a11y": eslintPluginJsxA11y,
    },
    rules: {
      ...eslintPluginJsxA11y.configs.strict.rules,
    },
  },
];
