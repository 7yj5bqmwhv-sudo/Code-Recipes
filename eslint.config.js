import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/**"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  { files: ["scripts/**/*.mjs"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginReact.configs.flat.recommended, pluginReact.configs.flat["jsx-runtime"],
  { settings: { react: { version: "detect" } }, rules: { "react/prop-types": "off" } }
]);
