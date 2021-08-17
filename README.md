# Vue Portable Text

Render an array of [portable text](https://github.com/portabletext/portabletext) from Sanity with Vue.

> This package works for just Vue 2 for now. However when Nuxt 3 comes out, v2 will support Vue 3 as well. (Not sure if I will maintain Vue 2 support with [vue-demi](https://github.com/vueuse/vue-demi) or support Vue 2 for v1 only)

## Install

```bash
# NPM
npm install --save @bizurd/vue-portable-text

# Yarn
yarn add @bizurd/vue-portable-text

# PNPM
pnpm add @bizurd/vue-portable-text
```

## Usage

Vue 2:

```vue
<template>
  <VuePortableText :blocks="blocks" :serializers="serializers" />
</template>

<script>
import VuePortableText from '@bizurd/vue-portable-text'

export default {
  components: {
    VuePortableText,
  },

  data() {
    return {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Hello World!',
            },
          ],
        },
      ],
      serializers: {
        styles: {
          // Just for example, I would not recommend doing this
          normal: 'h1',
        },
      },
    }
  },
}
</script>
```

### Custom Serializers

You can create custom serializers using Vue components.

#### Example 1: Heading Component with `id`

Here's an example that adds `id` to headings.

(You'll need `slugify` installed for this example)

In `MyHeading.vue`:

```vue
<template>
  <component :id="id" :is="block.style">
    <slot />
  </component>
</template>

<script>
import slugify from 'slugify'
import { getTextOfBlocks } from '../portable-text/PortableText'

export default {
  props: {
    block: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    id() {
      if (!['h1', 'h2', 'h3'].includes(this.block.style)) return undefined

      const text = block.children.reduce((text, block) => text + block.text, '')

      return slugify(text.toLowerCase())
    },
  },
}
</script>
```

Wherever you're rendering the portable text:

```vue
<template>
  <VuePortableText :blocks="blocks" :serializers="serializers" />
</template>

<script>
import MyHeading from './MyHeading.vue'
import VuePortableText from '@bizurd/vue-portable-text'

export default {
  components: {
    VuePortableText,
  },

  data() {
    return {
      blocks: [
        {
          style: 'h1',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Look the heading has an id!',
            },
          ],
        },
      ],
      serializers: {
        styles: {
          h1: MyHeading,
          h2: MyHeading,
          h3: MyHeading,
        },
      },
    }
  },
}
</script>
```
