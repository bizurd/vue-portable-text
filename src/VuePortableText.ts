import Vue, { CreateElement, PropType } from 'vue'
import defu from 'defu'
import { Serializers } from './types/serializers'
import { VNode } from 'vue/types/umd'
import { defaultSerializers } from './serializers'

type Blocks = any[] | any
type Block = any

const createList = (block: Block, blocks: Blocks, serializers: Serializers) => {
  const listItems = getListItems(block, blocks, serializers)

  return {
    _type: 'list',
    listItems,
    list: block.listItem,
  }
}

const getListItems = (
  block: Block,
  blocks: Blocks,
  serializers: Serializers
) => {
  const listItems = []

  const level = block.level
  const listStyleType = block.listItem
  while (block) {
    if (block.listItem === listStyleType && block.level === level) {
      listItems.push({
        _type: 'listItem',
        level: block.level,
        children: [block],
      })
    } else if (block.level > level && listItems.length) {
      const list = createList(block, blocks, serializers)

      const lastListItem = listItems[listItems.length - 1]
      lastListItem.children = [...lastListItem.children, list]
    } else {
      blocks.unshift(block)
      break
    }
    block = blocks.shift()
  }

  return listItems
}

const groupListItems = (blocks: Blocks, serializers: Serializers) => {
  // Copy the blocks array so we can modify it
  blocks = blocks.slice()

  const newBlocks = []

  while (blocks.length) {
    const block = blocks.shift()
    if (block && block.listItem) {
      newBlocks.push(createList(block, blocks, serializers))
    } else {
      newBlocks.push(block)
    }
  }

  return newBlocks
}

const renderSpan = (
  h: CreateElement,
  block: Block,
  serializers: Serializers,
  markDefs: { _key: string; _type: string; [x: string]: any }[]
) => {
  if (!block.marks || block.marks.length === 0) return block.text

  const marks = block.marks.slice().reverse()
  return marks.reduce((previousVNode: VNode | string, mark: string) => {
    let el = serializers.marks[mark]
    const markDef = markDefs.find((markDef) => markDef._key === mark)

    if (markDef) {
      el ||= serializers.marks[markDef._type]
    }

    return el
      ? h(el, { props: { block, markDef } }, [previousVNode])
      : previousVNode
  }, block.text)
}

const renderList = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  let children = []
  if (block.listItems) {
    children = block.listItems.map((listItem: Block) =>
      renderListItem(h, listItem, serializers)
    )
  }

  return h(
    block.list === 'number' ? serializers.list.number : serializers.list.bullet,
    { props: { block } },
    children
  )
}

const renderListItem = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  return h(
    serializers.listItem,
    { props: { block } },
    renderChildren(h, block, serializers)
  )
}

const renderChildren = (
  h: CreateElement,
  block: Blocks,
  serializers: Serializers
) => {
  let children = []
  if (block.children) {
    children = block.children.map((child: Block) => {
      if (child._type === 'span') {
        return renderSpan(h, child, serializers, block.markDefs || [])
      } else if (child._type === 'list') {
        return renderList(h, child, serializers)
      } else if (child._type === 'block') {
        return renderBlock(h, child, serializers)
      } else {
        return renderCustomType(h, child, serializers)
      }
    })
  }

  return children
}

const renderBlock = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  return h(
    serializers.styles[block.style],
    { props: { block } },
    renderChildren(h, block, serializers)
  )
}

const renderCustomType = (
  h: CreateElement,
  block: Block,
  serializers: Serializers
) => {
  const serializer = serializers.types[block._type]
  if (serializer)
    return h(
      serializer,
      { props: { block } },
      renderChildren(h, block, serializers)
    )

  return h(serializers.styles.normal, {}, renderChildren(h, block, serializers))
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
      } else if (block._type === 'list') {
        return renderList(h, block, serializers)
      } else {
        return renderCustomType(h, block, serializers)
      }
    })

    return h(this.as || serializers.container, {}, children)
  },
})
