import { lookupCollections } from '@iconify/json';
import { writeFile } from 'node:fs/promises';

/**
 * Generates TypeScript types for available Iconify icon collections.
 *
 * Retrieves all the available Iconify icon collections from the @iconify/json package.
 * Then creates a type `IconPrefix` with all the collection prefixes and writes this to src/icon-types.gen.ts.
 *
 * This allows us to get autocomplete/validation for icon collections.
 *
 * @returns {Promise<void>}
 */
async function generateTypes() {
  const collections = await lookupCollections();
  const prefixes = Object.keys(collections);

  const types = `export type IconPrefix = ${prefixes.map((prefix) => `'${prefix}'`).join(' | ')};`;

  await writeFile('src/lib/icon-types.gen.ts', types);
}

generateTypes();
