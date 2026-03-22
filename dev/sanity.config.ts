import { defineConfig, defineField, defineType } from 'sanity';
import { structureTool } from 'sanity/structure';
import { iconify } from '../src';

const iconifyPluginTest = defineType({
  name: 'iconifyPluginTest',
  title: 'Test Document',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'icon',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
});

export default defineConfig({
  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,
  title: 'Plugin Dev Studio',
  plugins: [structureTool(), iconify()],
  schema: {
    types: [iconifyPluginTest],
  },
});
