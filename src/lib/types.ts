import type { IconifyInfo } from '@iconify/types';
import type {
  BaseSchemaDefinition,
  ConditionalPropertyCallbackContext,
  FieldGroupDefinition,
  FieldsetDefinition,
  InitialValueProperty,
  ObjectOptions,
  RuleDef,
  ValidationBuilder,
} from 'sanity';

// If this line errors, the type definitions have not been generated.
import type { IconPrefix } from './icon-types.gen';

// Export types that need to be bundled with the plugin
export type {
  BaseSchemaDefinition,
  ConditionalPropertyCallbackContext,
  RuleDef,
  FieldGroupDefinition,
  FieldsetDefinition,
  InitialValueProperty,
} from 'sanity';

export type { IconPrefix };

export type IconOptions = {
  collections?: IconPrefix[];
  showName?: boolean;
} & Pick<ObjectOptions, 'collapsed' | 'collapsible'>;

export interface IconifyPluginConfig {
  collections?: IconPrefix[];
  showName?: boolean;
}

export interface IconifySearchResult {
  icons: string[];
  collections: Record<string, IconifyInfo>;
}

// Extend the Sanity schema types to include our custom type
export type IconValue =
  | {
      name?: string;
    }
  | undefined;

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

export interface IconDefinition extends Omit<BaseSchemaDefinition, 'hidden' | 'readOnly'> {
  type: 'icon';
  groups?: FieldGroupDefinition[];
  fieldsets?: FieldsetDefinition[];
  options?: IconOptions;
  hidden?: IconConditionalProperty;
  readOnly?: IconConditionalProperty;
  validation?: ValidationBuilder<IconRule, IconValue>;
  initialValue?: InitialValueProperty<any, IconValue>;
}

declare module 'sanity' {
  export interface IntrinsicDefinitions {
    icon: IconDefinition;
  }
}
