import Vue, { CreateElement, PropType } from 'vue'
import defu from 'defu'
import { Serializers } from './types/serializers'

type Blocks = any[] | any
type Block = any

const groupListItems = (blocks: Blocks, serializers: Serializers) => {
  // Copy the blocks array so we can modify it
  blocks = blocks.slice()

  const newBlocks = []

  while (blocks.length) {
    let block = blocks.shift()
    if (block && block.listItem) {
      while (block && block.listItem) {
        const children = []
        const listStyleType = block.listItem
        while (block && block.listItem === listStyleType) {
          children.push(block)
          block = blocks.shift()
        }

        const style =
          listStyleType === 'number'
            ? serializers.list.number
            : serializers.list.bullet

        newBlocks.push({
          _type: 'block',
          style,
          children,
          listStyleType,
        })
      }
    } else {
      newBlocks.push(block)
    }
  }

  return newBlocks
}

const renderSpan = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  if (!block.marks || block.marks.length === 0) return block.text

  return block.marks.reduce((elements: any, mark: Block) => {
    const el = serializers.marks[mark]
    return el ? h(el, { props: { block } }, [elements]) : elements
  }, block.text)
}

const renderListItem = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  let children = []
  if (block.children) {
    children = block.children.map((child: Block) =>
      renderChild(h, child, serializers)
    )
  }

  const child = h(
    serializers.styles[block.style],
    { props: { block } },
    children
  )

  return h(serializers.listItem, { props: { block } }, [child])
}

const renderChild = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  if (block._type === 'span') return renderSpan(h, block, serializers)
  if (block.listItem) return renderListItem(h, block, serializers)
  return renderCustomType(h, block, serializers)
}

const renderBlock = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  let children = []
  if (block.children) {
    children = block.children.map((child: Block) =>
      renderChild(h, child, serializers)
    )
  }

  return h(serializers.styles[block.style], { props: { block } }, children)
}

const renderCustomType = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  const serializer = serializers.types[block._type]

  let children = []
  if (block.children) {
    children = block.children.map((child: Block) =>
      renderChild(h, child, serializers)
    )
  }

  if (serializer) return h(serializer, { props: { block } }, children)

  return h(serializers.styles.normal, {}, children)
}

export const defaultSerializers = {
  types: {
    span: 'span',
  },
  marks: {
    strong: 'strong',
    em: 'em',
    link: 'a',
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

export default Vue.extend({
  name: 'VuePortableText',

  props: {
    as: {
      type: String,
      default: undefined,
    },
    blocks: {
      type: Array as PropType<any[] | any>,
      default: () => [],
    },
    serializers: {
      type: Object as PropType<Partial<Serializers>>,
      default: () => ({}),
    },
  },

  render(h) {
    const serializers = defu(
      this.serializers || {},
      defaultSerializers
    ) as Serializers

    const blocks = groupListItems(this.blocks, serializers)

    const children = blocks.map((block) => {
      if (block._type === 'block') {
        return renderBlock(h, block, serializers)
      } else {
        return renderCustomType(h, block, serializers)
      }
    })

    return h(this.as || serializers.container, {}, children)
  },
})
