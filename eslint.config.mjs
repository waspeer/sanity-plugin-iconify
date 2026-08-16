// @ts-check
import * as query from '@tanstack/eslint-plugin-query';
import { configs } from '@waspeer/config/eslint';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  configs.base,
  query.default.configs['flat/recommended'],
  [
    {
      // '**/dist' rather than 'dist' so the dev studio's production build output
      // (dev/dist, produced by `test:e2e:dist`) is ignored too.
      ignores: ['v2-incompatible.js', '*.cjs', '**/dist', 'package.config.ts', '*.gen.ts'],
    },
    {
      files: ['scripts/**'],
      languageOptions: {
        globals: { URL: 'readonly', console: 'readonly', process: 'readonly' },
      },
    },
  ],
].flat();

export default config;
