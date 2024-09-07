// @ts-check
import * as query from '@tanstack/eslint-plugin-query';
import { configs } from '@waspeer/config/eslint';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  configs.base,
  (query.default.configs['flat/recommended']),
  [
    {
      ignores: ['v2-incompatible.js', '*.cjs', 'dist', 'package.config.ts', '*.gen.ts'],
    },
  ],
].flat();

export default config;
