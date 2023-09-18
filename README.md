<div align="center">
  <img src="https://api.iconify.design/line-md:iconify1.svg?color=%23026c9c" width="100" />
  <h1 align="center">Sanity Plugin Iconify</h1>
  <h3>Custom input with over 150,000 open source vector icons</h3>

  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://snyk.io/test/github/waspeer/sanity-plugin-iconify/badge.svg" alt"Known Vulnerabilities" />
  <img src="https://img.shields.io/github/license/waspeer/sanity-plugin-iconify?style&color=5D6D7E" alt="GitHub license" />
</div>

---

## 📒 Table of Contents
- [📒 Table of Contents](#-table-of-contents)
- [📍 Overview](#-overview)
- [🚀 Getting Started](#-getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Add Icon schema type](#add-icon-schema-type)
- [✨ Usage](#-usage)
  - [Options](#options)
    - [`collections`](#collections)
    - [`showName`](#showname)
  - [Output](#output)
  - [Preview](#preview)
- [🤝 Contributing](#-contributing)
- [🧪 Develop \& test](#-develop--test)
- [👏 Acknowledgments](#-acknowledgments)
- [📄 License](#-license)

---


## 📍 Overview

Enhance your [Sanity](https://www.sanity.io/) project with the Iconify plugin, which introduces an Icon schema type and a custom input component. Leveraging the extensive library of open-source vector icons available through the [Iconify](https://iconify.design/), this plugin enables you to effortlessly select and integrate over 150,000 icons from popular icon sets directly into your Sanity project.

<div align="center">
  <img src="https://github.com/waspeer/sanity-plugin-iconify/assets/11842931/f937c953-a87d-431e-85b6-e3938d69ddac" width="600" />
</div>

## 🚀 Getting Started

### Installation

Install the plugin:

```sh
npm install sanity-plugin-iconify
```

```sh
yarn add sanity-plugin-iconify
```

```sh
pnpm add sanity-plugin-iconify
```

### Configuration

Then add it as a plugin in `sanity.config.ts` (or .js):

```ts
import { defineConfig } from 'sanity';
import { iconify } from 'sanity-plugin-iconify';

export default defineConfig({
  //...
  plugins: [iconify({
    // Optional configuration

    // Filter icons by collection for all Icon fields (this field has typed autocomplete ✨)
    // Defaults to empty array (all collections)
    collections: ['fa-brands', 'mdi', ...],

    // Shows the selected icon name and collection underneath the icon picker
    // Defaults to false
    showName: false,
  })],
});
```

(Read more on configuration options [here](#options).)

### Add Icon schema type

Use the Icon schema type in your Sanity schemas:

```ts
const type = defineType({
  type: 'document'
  name: 'myDocument',
  title: 'My Document',
  // ...
  fields: [
    // ...
    {
      name: 'myIcon',
      title: 'My Icon',
      type: 'icon', // <-- Icon schema type
    },
  ],
})
```

Learn more about Sanity schema types [here](https://www.sanity.io/docs/schema-types).

## ✨ Usage

### Options

#### `collections`

Filter icons by collection for all Icon fields. This option allows you to categorize icons based on predefined sets, making it easier to navigate and select from a curated list of icons. You can specify this field both in the plugin options and in the schema type options, with the latter overriding the plugin options. The package includes types for all collection prefixes, enabling typed autocomplete for this field.

**Default:** `[]` (all collections)

```ts
import { defineConfig } from 'sanity';

export default defineConfig({
  //...
  plugins: [iconify({
    collections: ['fa-brands', 'mdi', ...], // <-- Filter icons by collection for all Icon fields
  })],
});
```

```ts
const type = defineType({
  type: 'document'
  name: 'myDocument',
  title: 'My Document',
  // ...
  fields: [
    // ...
    {
      name: 'myIcon',
      title: 'My Icon',
      type: 'icon',
      options: {
        collections: ['fa-brands', 'mdi', ...], // <-- Filter icons by collection for this field
      },
    },
  ],
})
```

#### `showName`

Enables the display of the selected icon's name and collection underneath the icon picker, providing a quick reference and ease of identification. This field can be specified in both the plugin options and the schema type options, with the schema type options having priority over the plugin options.

**Default:** `false`

```ts
import { defineConfig } from 'sanity';

export default defineConfig({
  //...
  plugins: [iconify({
    showName: true, // <-- Shows the selected icon name and collection underneath all icon pickers
  })],
});
```

```ts
const type = defineType({
  type: 'document'
  name: 'myDocument',
  title: 'My Document',
  // ...
  fields: [
    // ...
    {
      name: 'myIcon',
      title: 'My Icon',
      type: 'icon',
      options: {
        showName: true, // <-- Shows the selected icon name and collection underneath this icon picker
      },
    },
  ],
})
```

### Output

The Icon schema type outputs an object with the icon name.

```ts
{
  _type: 'icon',
  name: string; // The iconify name of the icon
}
```

This name can be utilized in your frontend to render the icon dynamically. For instance, using [React Iconify](https://iconify.design/docs/icon-components/react/) allows you to render the icon as demonstrated below:

```tsx
import { Icon } from '@iconify/react';

<Icon icon={icon.name} />
```

This will render an SVG on demand, which looks great and is very performant. There are also libraries/API's for:

- [Vue](https://iconify.design/docs/icon-components/vue/)
- [Svelte](https://iconify.design/docs/icon-components/svelte/)
- [Astro](https://iconify.design/docs/usage/svg/astro/)
- [And more (Plain SVGs, Tailwind, Web Components, etc.)](https://iconify.design/docs/usage/)

For further information, you may refer to the [official documentation](https://iconify.design/docs).

### Preview

The plugin includes a custom list preview that automatically renders the selected icon accompanied by its name and collection. 

<img width="618" alt="array-of-icons" src="https://github.com/waspeer/sanity-plugin-iconify/assets/11842931/0c1c32a1-e796-434f-ae64-c134f9b51ab9">

If needed you can override this preview component by specifying your own in the schema type options. Use the `@iconify/react` package to render the icon.

```tsx
import { Icon } from '@iconify/react';
import { defineType } from 'sanity';

const type = defineType({
  type: 'array'
  name: 'myArray',
  title: 'My array of icons',
  of: [
    {
      type: 'icon',
      components: {
        preview: (props: PreviewProps) => {
          return props.renderDefault({
            ...props,
            title: 'Custom title',
            subtitle: 'Custom subtitle',
            media: <Icon icon={props.title as string} />, // <-- Renders the selected icon as media
          });
        },
      },
    },
  ],
})
```

Learn more about Sanity previews [here](https://www.sanity.io/docs/previews-list-views).

## 🤝 Contributing

Contributions, whether in the form of code enhancements, bug fixes, documentation, or design improvements, are always welcome! Here are the steps to get started:

1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
1. Make changes to the project's codebase.
2. Commit your changes to your local branch with a clear conventional commit message that explains the changes you've made.
```sh
git commit -m 'feat: Implemented new feature.'
```
1. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
1. Create a new pull request to the original project repository. In the pull request, describe the changes you've made and why they are necessary. Make sure to update or add documentation as relevant. I will review your changes, provide feedback, or merge them into the main branch.

## 🧪 Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit) with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio) on how to run this plugin with hotreload in the studio.

## 👏 Acknowledgments

- [sanity-plugin-icon-picker](https://github.com/christopherafbjur/sanity-plugin-icon-picker) - is a solid alternative built around `react-icons`.

## 📄 License

[MIT](LICENSE) © Wannes Salomé
