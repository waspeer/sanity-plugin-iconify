import { defineField } from 'sanity';

export const test = defineField({
  name: 'test',
  type: 'icon',
  hidden: ({ value }) => value.name === 'test',
  validation: (Rule) =>
    Rule.custom((value) => {
      const name = value?.name;
      return name === 'lucide:home' ? true : 'error';
    }),
});
