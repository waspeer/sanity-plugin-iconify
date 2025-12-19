import { defineField } from 'sanity';
import { describe, it, expectTypeOf } from 'vitest';
import type { IconValue } from './types';

describe('IconDefinition - Type Safety', () => {
  it('should strongly type value as IconValue in validation callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      validation: (Rule) =>
        Rule.custom((value) => {
          // value should be typed as IconValue
          expectTypeOf(value).toExtend<IconValue>();
          expectTypeOf(value?.name).toExtend<string | undefined>();

          // Should support real-world validation logic
          if (!value?.name) {
            return 'Icon is required';
          }

          if (!value.name.startsWith('mdi:')) {
            return 'Only Material Design Icons are allowed';
          }

          return true;
        }),
    });
  });

  it('should strongly type value as IconValue in hidden callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      hidden: ({ value, document }) => {
        // value should be typed as IconValue
        expectTypeOf(value).toExtend<IconValue>();
        expectTypeOf(value?.name).toExtend<string | undefined>();

        // Should support real-world conditional logic
        return value?.name === 'hidden-icon' || document?._type === 'simple';
      },
    });
  });

  it('should strongly type value as IconValue in readOnly callbacks', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      readOnly: ({ value, document }) => {
        // value should be typed as IconValue
        expectTypeOf(value).toExtend<IconValue>();
        expectTypeOf(value?.name).toExtend<string | undefined>();

        // Should support real-world conditional logic
        const isPublished = document?.published === true;
        const isSystemIcon = value?.name?.startsWith('system:') ?? false;

        return isPublished && isSystemIcon;
      },
    });
  });

  it('should maintain IconValue type across all callbacks when combined', () => {
    defineField({
      name: 'icon',
      type: 'icon',
      hidden: ({ value }) => {
        expectTypeOf(value).toExtend<IconValue>();
        return value?.name === 'test';
      },
      readOnly: ({ value }) => {
        expectTypeOf(value).toExtend<IconValue>();
        return value?.name === 'locked';
      },
      validation: (Rule) =>
        Rule.custom((value) => {
          expectTypeOf(value).toExtend<IconValue>();
          return value?.name === 'lucide:home' ? true : 'error';
        }),
    });
  });
});
