/* eslint-disable vue/one-component-per-file */
import { mount } from '@vue/test-utils'
import Vue from 'vue'
import VuePortableText from '../VuePortableText'

test('no blocks or serializers', () => {
  const wrapper = mount(VuePortableText)

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toMatchSnapshot()
})

test('serializers = null', () => {
  const wrapper = mount(VuePortableText, {
    propsData: {
      serializers: null,
    },
  })

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toMatchSnapshot()
})

test('as = article', () => {
  const wrapper = mount(VuePortableText, {
    propsData: {
      as: 'article',
    },
  })

  expect(wrapper.element).toBeEmptyDOMElement()
  expect(wrapper.element).toMatchSnapshot()
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
  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
})

test('block no style > plain text', () => {
  const normalText = 'This should be normal text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
})

test('block.normal > text with nonexistent marks', () => {
  const plainText = 'This should be plain text'
  const stillPlainText = 'This should be still be plain text'

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
              marks: ['nonexistent'],
              text: stillPlainText,
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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

  expect(wrapper.element).toMatchSnapshot()
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
              children: [
                {
                  _type: 'span',
                  text: text,
                },
              ],
            },
          ],
        },
      ],
    },
  })

  expect(wrapper.element).toMatchSnapshot()
})

test('block.normal (listItem=bullet) * 2 with no level on first listItem > plain text', () => {
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
          level: 2,
          listItem: 'bullet',
        },
      ],
    },
  })

  expect(wrapper.element).toMatchSnapshot()
})

test('block.normal (listItem=bullet) * 2 with no children for first item > plain text', () => {
  const plainText = 'This should be plain text'

  const wrapper = mount(VuePortableText, {
    propsData: {
      blocks: [
        {
          style: 'normal',
          _type: 'block',
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
          level: 2,
          listItem: 'bullet',
        },
      ],
    },
  })

  expect(wrapper.element).toMatchSnapshot()
})
