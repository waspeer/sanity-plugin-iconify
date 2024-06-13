// @ts-check
import * as query from '@tanstack/eslint-plugin-query';
import { configs } from '@waspeer/config/eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  configs.base,
  [
    {
      plugins: {
        '@tanstack/query': /** @type {any} */ (query),
      },
      rules: /** @type {any} */ (query.configs.recommended.rules),
    },
    {
      ignores: ['v2-incompatible.js', '*.cjs', 'dist', 'package.config.ts', '*.gen.ts'],
    },
  ],
].flat();

export default config;
