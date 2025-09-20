import js from "@eslint/js";
import pluginNextJs from "@next/eslint-plugin-next";
import parser from "@typescript-eslint/parser";
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
  // https://github.com/vercel/next.js/discussions/49337#discussioncomment-5998603
  {
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs["jsx-runtime"].rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
  // REF: https://github.com/vercel/next.js/issues/71763#issuecomment-2476838298
  {
    name: "Next.js Plugin",
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@next/next": pluginNextJs,
    },
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    rules: {
      ...pluginNextJs.configs.recommended.rules,
      ...pluginNextJs.configs["core-web-vitals"].rules,
    },
  },
  // R\ed https://prettier.io/docs/integrating-with-linters
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
