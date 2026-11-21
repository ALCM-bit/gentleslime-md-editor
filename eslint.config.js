// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

// AGENTS.md rule 4: the core and the editor must not know the platform.
const platformImports = {
  patterns: [
    {
      group: [
        "@tauri-apps/*",
        "@angular/*",
        "@gentleslime/adapters",
        "@gentleslime/ui",
      ],
      message:
        "packages/core and packages/editor are platform-agnostic. Access the platform through PlatformAdapter.",
    },
  ],
  paths: [
    {
      name: "fs",
      message: "Use PlatformAdapter instead of direct file access.",
    },
    {
      name: "node:fs",
      message: "Use PlatformAdapter instead of direct file access.",
    },
    {
      name: "fs/promises",
      message: "Use PlatformAdapter instead of direct file access.",
    },
    {
      name: "node:fs/promises",
      message: "Use PlatformAdapter instead of direct file access.",
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.angular/**",
      "**/.turbo/**",
      "**/out-tsc/**",
      "apps/native/src-tauri/**",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ["**/*.config.{js,ts}"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["packages/core/**/*.ts", "packages/editor/**/*.ts"],
    rules: { "no-restricted-imports": ["error", platformImports] },
  },
  {
    files: ["apps/native/src/**/*.ts", "packages/ui/src/**/*.ts"],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: ["app", "gs"], style: "kebab-case" },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: ["app", "gs"], style: "camelCase" },
      ],
    },
  },
  {
    files: ["apps/native/src/**/*.html", "packages/ui/src/**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
  prettier,
);
