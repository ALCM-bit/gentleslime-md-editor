// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

// AGENTS.md rule 4: the core and the editor must not know the platform.
const fsMessage = 'Use PlatformAdapter instead of direct file access.';
const platformImports = {
  patterns: [
    {
      group: ['@tauri-apps/*', '@angular/*', '@gentleslime/adapters', '@gentleslime/ui'],
      message:
        'packages/core and packages/editor are platform-agnostic. Access the platform through PlatformAdapter.',
    },
  ],
  paths: ['fs', 'node:fs', 'fs/promises', 'node:fs/promises'].map((name) => ({
    name,
    message: fsMessage,
  })),
};

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.angular/**',
      '**/.turbo/**',
      '**/out-tsc/**',
      'apps/native/src-tauri/**',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    // Plain JS config files are not part of any tsconfig.
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['**/*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['packages/core/**/*.ts', 'packages/editor/**/*.ts'],
    rules: { 'no-restricted-imports': ['error', platformImports] },
  },
  {
    files: ['apps/native/src/**/*.ts', 'packages/ui/src/**/*.ts'],
    // tsRecommended already enforces default OnPush, standalone and inject().
    extends: [angular.configs.tsRecommended],
    processor: angular.createProcessor(),
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: ['app', 'gs'], style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: ['app', 'gs'], style: 'camelCase' },
      ],
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-host-metadata-property': 'error',
      '@angular-eslint/no-uncalled-signals': 'error',
    },
  },
  {
    files: ['apps/native/src/**/*.html', 'packages/ui/src/**/*.html'],
    // templateRecommended already enforces the built-in control flow.
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
      '@angular-eslint/template/prefer-class-binding': 'error',
      '@angular-eslint/template/prefer-style-binding': 'error',
    },
  },
  prettier,
);
