import { defineField } from 'sanity';
import { describe, expectTypeOf, it } from 'vitest';
import type { IconValue } from './types';

// These are type-level tests: they fail at compile time if types are wrong,
// not at runtime. Credit: danilo-arioli (PR #13).

describe('IconDefinition type safety', () => {
  it('types value as IconValue in validation callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      validation: (Rule) =>
        Rule.custom((value) => {
          expectTypeOf(value).toExtend<IconValue>();
          expectTypeOf(value?.name).toExtend<string | undefined>();
          return value?.name ? true : 'Icon is required';
        }),
    });
  });

  it('types value as IconValue in hidden callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      hidden: ({ value, document }) => {
        expectTypeOf(value).toExtend<IconValue>();
        expectTypeOf(value?.name).toExtend<string | undefined>();
        return value?.name === 'hidden-icon' || document?._type === 'simple';
      },
    });
  });

  it('types value as IconValue in readOnly callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      readOnly: ({ value, document }) => {
        expectTypeOf(value).toExtend<IconValue>();
        expectTypeOf(value?.name).toExtend<string | undefined>();
        return document?.published === true && (value?.name?.startsWith('system:') ?? false);
      },
    });
  });

  it('accepts collapsible and collapsed options', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      options: {
        collapsible: true,
        collapsed: false,
        collections: ['mdi'],
      },
    });
  });
});
