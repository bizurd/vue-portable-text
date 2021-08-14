import Vue from 'vue'
import { Serializers } from './types/serializers'

const linkSerializer = Vue.extend({
  props: {
    markDef: {
      type: Object,
      required: true,
    },
  },
  render(h) {
    return h('a', { attrs: { href: this.markDef.href } }, this.$slots.default)
  },
})

export const defaultSerializers: Serializers = {
  types: {
    span: 'span',
  },
  marks: {
    strong: 'strong',
    em: 'em',
    link: linkSerializer,
    underline: 'u',
  },
  styles: {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    ol: 'ol',
    ul: 'ul',
    normal: 'p',
    blockquote: 'blockquote',
  },
  listItem: 'li',
  list: {
    number: 'ol',
    bullet: 'ul',
  },
  container: 'div',
}
