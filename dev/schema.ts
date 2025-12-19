import { defineField } from 'sanity';

export const test = defineField({
  name: 'test',
  type: 'icon',
  hidden: ({ value }) => value.name === 'test',
  validation: (Rule) =>
    Rule.custom((value) => {
      const test = value?.name;
      return test === 'yihaa' ? true : 'error';
    }),
});
