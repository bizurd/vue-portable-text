/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VuePortableText, { defaultSerializers as ds } from '../VuePortableText'

const container = ds.container
const p = ds.styles.normal
const h1 = ds.styles.h1
const h3 = ds.styles.h3
const blockquote = ds.styles.blockquote
const strong = ds.marks.strong
const a = ds.marks.link
const ul = ds.list.bullet
const ol = ds.list.number
const li = ds.listItem

test('no blocks or serializers', () => {
  const wrapper = mount(VuePortableText)

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toContainHTML(`<${ds.container}></${ds.container}>`)
})

test('serializers = null', () => {
  const wrapper = mount(VuePortableText, {
    propsData: {
      serializers: null,
    },
  })

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toContainHTML(`<${ds.container}></${ds.container}>`)
})

test('as = article', () => {
  const wrapper = mount(VuePortableText, {
    propsData: {
      as: 'article',
    },
  })

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toContainHTML(`<article></article>`)
})

test('serializers.container = article', () => {
  const wrapper = mount(VuePortableText, {
    propsData: {
      serializers: {
        container: 'article',
      },
    },
  })

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toContainHTML(`<article></article>`)
})

test('block.normal > plain text', () => {
  const normalText = 'This should be normal text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: normalText,
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${p}>${normalText}</${p}></${container}>`
  )
})

test('block.h1 > plain text', () => {
  const h1Text = 'This should be a h1'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'h1',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: h1Text,
            },
          ],
          markDefs: [],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${h1}>${h1Text}</${h1}></${container}>`
  )
})

test('block.h3 > plain text + block.blockquote > plain text', () => {
  const h3Text = 'This should be a h3'
  const blockquoteText = 'This should be a blockquote'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'h3',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: h3Text,
            },
          ],
          markDefs: [],
        },
        {
          style: 'blockquote',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: blockquoteText,
            },
          ],
          markDefs: [],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${h3}>${h3Text}</${h3}><${blockquote}>${blockquoteText}</${blockquote}></${container}>`
  )
})

test('block.normal > text with marks', () => {
  const plainText = 'This should be plain text'
  const strongLinkText = 'This should be a strong link'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
            {
              _type: 'span',
              marks: ['a-key', 'strong'],
              text: strongLinkText,
            },
          ],
          markDefs: [
            {
              _key: 'a-key',
              _type: 'link',
              href: 'https://example.com',
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${p}>${plainText}<${a} href="https://example.com"><${strong}>${strongLinkText}</${strong}></${a}></${p}></${container}>`
  )
})

test('block.normal (listItem=bullet) * 3 > plain text', () => {
  const plainText = 'This should be plain text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 1,
          listItem: 'bullet',
        },
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 1,
          listItem: 'bullet',
        },
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 1,
          listItem: 'bullet',
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${ul}><${li}><${p}>${plainText}</${p}></${li}><${li}><${p}>${plainText}</${p}></${li}><${li}><${p}>${plainText}</${p}></${li}></${ul}></${container}>`
  )
})

test('block.h3 (listItem=bullet) > text with marks', () => {
  const h3Text = 'This should be a h3'
  const strongLinkText = 'This should be a strong link'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'h3',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: h3Text,
            },
            {
              _type: 'span',
              marks: ['a-key', 'strong'],
              text: strongLinkText,
            },
          ],
          markDefs: [
            {
              _key: 'a-key',
              _type: 'link',
              href: 'https://example.com',
            },
          ],
          level: 1,
          listItem: 'bullet',
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${ul}><${li}><${h3}>${h3Text}<${a} href="https://example.com"><${strong}>${strongLinkText}</${strong}></${a}></${h3}></${li}></${ul}></${container}>`
  )
})

test('block.normal (listItem=numeric) * 3 with nested bullet list > plain text', () => {
  const plainText = 'This should be plain text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 1,
          listItem: 'number',
        },
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 2,
          listItem: 'bullet',
        },
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: plainText,
            },
          ],
          level: 1,
          listItem: 'number',
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${ol}><${li}><${p}>${plainText}</${p}></${li}><${li}><${ul}><${li}><${p}>${plainText}</${p}></${li}></${ul}></${li}><${li}><${p}>${plainText}</${p}></${li}></${ol}></${container}>`
  )
})

test('customType > text', () => {
  const text = 'This should be normal text'

  const CustomTypeComponent = Vue.extend({
    props: {
      block: {
        type: Object,
        required: true,
      },
    },
    render(h) {
      return h(
        'h1',
        { attrs: { 'data-type': this.block._type } },
        this.$slots.default
      )
    },
  })

  const wrapper = mount(VuePortableText, {
    propsData: {
      serializers: {
        types: {
          customType: CustomTypeComponent,
        },
      },
      blocks: [
        {
          _type: 'customType',
          children: [
            {
              _type: 'span',
              text: text,
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><h1 data-type="customType">${text}</h1></${container}>`
  )
})

test('non-existent customType > text', () => {
  const text = 'This should be normal text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          _type: 'customType',
          children: [
            {
              _type: 'span',
              text: text,
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${p}>${text}</${p}></${container}>`
  )
})

test('block.normal > customType', () => {
  const text = 'This should be normal text'

  const CustomTypeComponent = Vue.extend({
    props: {
      block: {
        type: Object,
        required: true,
      },
    },
    render(h) {
      return h(
        'span',
        { attrs: { 'data-type': this.block._type } },
        this.$slots.default
      )
    },
  })

  const wrapper = mount(VuePortableText, {
    propsData: {
      serializers: {
        types: {
          customType: CustomTypeComponent,
        },
      },
      blocks: [
        {
          style: 'normal',
          _type: 'block',
          children: [
            {
              _type: 'customType',
              text: text,
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toContainHTML(
    `<${container}><${p}><span data-type="customType">${text}</span><${p}></${container}>`
  )
})
