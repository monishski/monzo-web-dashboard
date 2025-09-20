/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */
const prettierConfig = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 75,
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/lib(/?.*)$",
    "^@/store(/?.*)$",
    "^@/context(/?.*)$",
    "^@/features(/?.*)$",
    "^@/api(/?.*)$",
    "^@/components(/?.*)$",
    "^@/hooks(/?.*)$",
    "^@/utils(/?.*)$",
    "^@/config(/?.*)$",
    "^@/(.*)$",
    "",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderCaseSensitive: false,
  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["tv"],
};

export default prettierConfig;
