import { definePlugin, FieldProps, ObjectInputProps } from 'sanity';

import { IconifyInput } from './iconify-input';
import { IconifyPreview } from './iconify-preview';
import { IconifyPluginConfig } from './lib/types';

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import { defineConfig } from 'sanity'
 * import { iconify } from 'sanity-plugin-iconify'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [iconify()],
 * })
 * ```
 */
export const iconify = definePlugin<IconifyPluginConfig | void>((config = {}) => {
  return {
    name: 'sanity-plugin-iconify',
    schema: {
      types: [
        {
          name: 'icon',
          title: 'Icon',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
          ],
          components: {
            input: (props: ObjectInputProps) => <IconifyInput {...props} config={config!} />,
            preview: IconifyPreview,

            // This makes sure the input component is not indented
            field: (props: FieldProps) => props.renderDefault({ ...props, level: 0 }),
          },
        },
      ],
    },
  };
});
