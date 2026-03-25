import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  tsconfig: 'tsconfig.dist.json',
  publint: true,
  deps: {
    // @iconify/types is a type-only import — bundling into declarations is intentional
    onlyBundle: false,
  },
});
