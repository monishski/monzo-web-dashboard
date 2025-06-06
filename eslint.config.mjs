import js from "@eslint/js";
import pluginNextJs from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  {
    ignores: ["**/node_modules/", "**/.next/", "**/build/", "**/dist/"],
  },
  {
    // The "js/recommended" configuration ensures all of the rules marked as recommended
    // on the rules page (https://eslint.org/docs/latest/rules) will be turned on
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    // https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  // https://typescript-eslint.io/users/configs#recommended
  ...tseslint.configs.recommended,
  // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#flat-configs
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginReactHooks.configs["recommended-latest"],
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "@next/next": pluginNextJs },
    rules: {
      ...pluginNextJs.configs.recommended.rules,
      ...pluginNextJs.configs["core-web-vitals"].rules,
    },
  },
  // https://prettier.io/docs/integrating-with-linters
  eslintConfigPrettier,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "react/prop-types": "off",
      "no-console": "error",
    },
  },
]);

export default eslintConfig;
