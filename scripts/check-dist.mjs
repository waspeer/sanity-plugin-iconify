/**
 * Fails the build/publish if any published artifact can't be parsed as plain JS
 * — most importantly, untranspiled JSX.
 *
 * Background: v4.0.0 shipped raw JSX in dist/index.{mjs,cjs} because the build
 * tsconfig had `jsx: "preserve"`, so consumers' bundlers (esbuild/Vite) failed
 * with "Unexpected JSX expression". `node --check` parses each artifact exactly
 * as Node/esbuild would — no deps, no browser — and catches it in milliseconds.
 * See: https://github.com/waspeer/sanity-plugin-iconify/issues/15
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const artifacts = ['../dist/index.mjs', '../dist/index.cjs'].map((rel) =>
  fileURLToPath(new URL(rel, import.meta.url)),
);

let failed = false;
for (const file of artifacts) {
  const name = file.split('/').slice(-2).join('/');
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    console.log(`✓ ${name} parses cleanly`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${name} failed to parse — likely untranspiled JSX (see issue #15):`);
    console.error(String(error.stderr || error.message).trim());
  }
}

if (failed) {
  console.error('\nPublished dist must be fully transpiled. Aborting.');
  process.exit(1);
}
