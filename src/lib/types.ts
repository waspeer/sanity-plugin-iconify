import type { IconifyInfo } from '@iconify/types';
import type { BaseSchemaDefinition } from 'sanity';

// If this line errors, the type definitions have not been generated.
import type { IconPrefix } from './icon-types.gen';

// Export types that need to be bundled with the plugin
export type { BaseSchemaDefinition } from 'sanity';
export type { IconPrefix };

export interface IconOptions {
  collections?: IconPrefix[];
  showName?: boolean;
}

export interface IconifyPluginConfig {
  collections?: IconPrefix[];
  showName?: boolean;
}

export interface IconifySearchResult {
  icons: string[];
  collections: Record<string, IconifyInfo>;
}

// Extend the Sanity schema types to include our custom type
declare module 'sanity' {
  interface IconDefinition extends BaseSchemaDefinition {
    type: 'icon';
    options?: IconOptions;
  }

  export interface IntrinsicDefinitions {
    icon: IconDefinition;
  }
}
