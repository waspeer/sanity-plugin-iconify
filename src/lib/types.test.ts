import { defineField } from 'sanity';
import type { IntrinsicDefinitions } from 'sanity';
import { describe, expectTypeOf, it } from 'vitest';
import type { IconDefinition, IconValue } from './types';

// These are type-level tests: they fail at compile time if types are wrong,
// not at runtime. Credit: danilo-arioli (PR #13).

describe('IconDefinition type safety', () => {
  it('registers icon in IntrinsicDefinitions (module augmentation)', () => {
    // If this fails, the declare module 'sanity' augmentation is broken and
    // Sanity won't recognise 'icon' as a valid type string in defineField/defineType.
    expectTypeOf<IntrinsicDefinitions['icon']>().toMatchTypeOf<IconDefinition>();
  });

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

  it('types value as IconValue in initialValue callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      initialValue: (params, context) => {
        expectTypeOf(context.currentUser).toMatchTypeOf<{ id: string } | null>();
        return { name: 'mdi:home' } satisfies IconValue;
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
        showName: true,
      },
    });
  });

  it('rejects unknown options', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      // @ts-expect-error unknown option should not be accepted
      options: { unknownOption: true },
    });
  });
});
