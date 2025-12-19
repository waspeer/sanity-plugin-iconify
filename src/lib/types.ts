import type { IconifyInfo } from '@iconify/types';
import type {
  BaseSchemaDefinition,
  ConditionalPropertyCallbackContext,
  FieldGroupDefinition,
  FieldsetDefinition,
  PreviewConfig,
  RuleDef,
  ValidationBuilder,
} from 'sanity';

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

export interface IconValue {
  name?: string;
}

// Extend the Sanity schema types to include our custom type
declare module 'sanity' {
  //eslint-disable-next-line
  export interface IconRule extends RuleDef<IconRule, IconValue> {}

  export type IconConditionalPropertyCallbackContext = Omit<
    ConditionalPropertyCallbackContext,
    'value'
  > & {
    value: IconValue;
  };

  export type IconConditionalPropertyCallback = (
    context: IconConditionalPropertyCallbackContext,
  ) => boolean;

  export type IconConditionalProperty = boolean | IconConditionalPropertyCallback | undefined;

  interface IconDefinition extends Omit<BaseSchemaDefinition, 'hidden' | 'readOnly'> {
    type: 'icon';
    groups?: FieldGroupDefinition[];
    fieldsets?: FieldsetDefinition[];
    preview?: PreviewConfig;
    options?: IconOptions;
    hidden?: IconConditionalProperty;
    readOnly?: IconConditionalProperty;
    validation?: ValidationBuilder<IconRule, IconValue>;
  }

  export interface IntrinsicDefinitions {
    icon: IconDefinition;
  }
}
