import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores(["dist/", "**/*.js"]),
  {
    files: ["**/*.ts"],
    plugins: { js, tseslint },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginPrettier,
]);
