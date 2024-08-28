import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    ignores: [
      "node_modules/**/*",
      "build/**/*",
      ".cache/**/*",
      ".vscode/**/*",
      ".idea/**/*"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off"
    },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    }
  }
];
