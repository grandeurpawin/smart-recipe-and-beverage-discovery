import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["js/**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];
