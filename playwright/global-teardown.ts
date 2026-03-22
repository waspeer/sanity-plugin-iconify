/**
 * Deletes all iconifyPluginTest documents created during e2e tests.
 *
 * Requires SANITY_STUDIO_TOKEN to be set (read+write API token).
 * Get one at https://www.sanity.io/manage → project → API → Tokens.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv(path: string): Record<string, string> {
  try {
    return Object.fromEntries(
      readFileSync(path, 'utf8')
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => line.split('=', 2) as [string, string]),
    );
  } catch {
    return {};
  }
}

export default async function globalTeardown() {
  const env = loadEnv(resolve(import.meta.dirname, '../dev/.env'));

  const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET ?? env.SANITY_STUDIO_DATASET ?? 'production';
  const token = process.env.SANITY_STUDIO_TOKEN ?? env.SANITY_STUDIO_TOKEN;

  if (!projectId || !token) {
    console.warn(
      '\n⚠  Skipping test document cleanup: set SANITY_STUDIO_TOKEN in dev/.env to enable automatic cleanup.\n',
    );
    return;
  }

  const base = `https://${projectId}.api.sanity.io/v2024-01-01/data`;

  // Query for all iconifyPluginTest IDs (published + drafts)
  const queryRes = await fetch(
    `${base}/query/${dataset}?query=${encodeURIComponent('*[_type == "iconifyPluginTest"]._id')}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const { result: ids } = (await queryRes.json()) as { result: string[] };

  if (!ids?.length) return;

  // Include both published and draft variants
  const allIds = [...new Set([...ids, ...ids.map((id) => `drafts.${id}`)])];

  const mutations = allIds.map((id) => ({ delete: { id } }));
  await fetch(`${base}/mutate/${dataset}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  });

  console.log(`\n🧹 Cleaned up ${ids.length} test document(s).\n`);
}
