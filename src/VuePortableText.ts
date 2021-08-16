import Vue, { CreateElement, PropType, VNodeChildren } from 'vue'
import defu from 'defu'
import { Serializers } from './types/serializers'
import { VNode } from 'vue/types/umd'
import { defaultSerializers } from './serializers'
import { Blocks } from './types/blocks'
import { isListItemBlock, ListItemBlock } from './types/listItemBlock'
import { PortableTextObject } from './types/portableTextObject'
import { ListItem } from './types/listItem'
import { isList, List } from './types/list'
import { Block, isBlock } from './types/block'
import { isSpan, Span } from './types/span'
import { isMarkDef, MarkDef } from './types/markDef'

const createList = (
  listItemBlock: ListItemBlock,
  blocks: Blocks,
  serializers: Serializers
): List => {
  const listItems = getListItems(listItemBlock, blocks, serializers)

  return {
    _type: 'list',
    children: listItems,
    list: listItemBlock.listItem,
  }
}

const getListItems = (
  listItemBlock: ListItemBlock,
  blocks: Blocks,
  serializers: Serializers
): ListItem[] => {
  const listItems: ListItem[] = []

  let block: PortableTextObject = listItemBlock
  const level = listItemBlock.level
  const listStyleType = listItemBlock.listItem
  while (block) {
    if (
      isListItemBlock(block) &&
      block.listItem === listStyleType &&
      block.level === level
    ) {
      const children: PortableTextObject[] = []
      if (
        block.children &&
        Array.isArray(block.children) &&
        block.children.length
      ) {
        children.push({
          _type: 'block',
          style: block.style,
          children: block.children,
        })
      }

      listItems.push({
        _type: 'listItem',
        level: block.level,
        children,
      })
    } else if (
      isListItemBlock(block) &&
      block.level !== undefined &&
      block.level > (level || 1) &&
      listItems.length
    ) {
      const list = createList(block, blocks, serializers)

      const lastListItem = listItems[listItems.length - 1]
      lastListItem.children = [...lastListItem.children, list]
    } else {
      blocks.unshift(block)
      break
    }

    const nextBlock = blocks.shift()
    if (nextBlock) {
      block = nextBlock
    } else {
      break
    }
  }

  return listItems
}

const groupListItems = (blocks: Blocks, serializers: Serializers): Blocks => {
  // Copy the blocks array so we can modify it
  blocks = blocks.slice()

  const newBlocks: Blocks = []

  while (blocks.length) {
    const block = blocks.shift()
    if (isListItemBlock(block)) {
      newBlocks.push(createList(block, blocks, serializers))
    } else if (block) {
      newBlocks.push(block)
    }
  }

  return newBlocks
}

const renderSpan = (
  h: CreateElement,
  span: Span,
  serializers: Serializers,
  markDefs: MarkDef[] = []
): VNode | string => {
  if (!span.marks || span.marks.length === 0) return span.text

  const marks = span.marks.slice().reverse()
  return marks.reduce((previousVNode: VNode | string, mark: string) => {
    let el = serializers.marks[mark]
    const markDef = markDefs.find((markDef) => markDef._key === mark)

    if (markDef) {
      el ||= serializers.marks[markDef._type]
    }

    return el
      ? h(el, { props: { block: span, markDef } }, [previousVNode])
      : previousVNode
  }, span.text)
}

const renderList = (
  h: CreateElement,
  list: List,
  serializers: Serializers
): VNode => {
  let children: VNodeChildren = []
  if (list.children) {
    children = list.children.map((listItem: ListItem) =>
      renderListItem(h, listItem, serializers)
    )
  }

  return h(
    list.list === 'number' ? serializers.list.number : serializers.list.bullet,
    { props: { block: list } },
    children
  )
}

const renderListItem = (
  h: CreateElement,
  listItem: ListItem,
  serializers: Serializers
) => {
  return h(
    serializers.listItem,
    { props: { block: listItem } },
    renderChildren(h, listItem, serializers)
  )
}

const renderChildren = (
  h: CreateElement,
  parent: PortableTextObject,
  serializers: Serializers
) => {
  let children: VNodeChildren = []
  if (parent.children) {
    children = parent.children.map((child: PortableTextObject) => {
      if (isSpan(child)) {
        const markDefs: MarkDef[] = []
        if (parent.markDefs && Array.isArray(parent.markDefs)) {
          parent.markDefs.forEach((markDef) => {
            if (isMarkDef(markDef)) {
              markDefs.push(markDef)
            }
          })
        }
        return renderSpan(h, child, serializers, markDefs)
      } else if (isList(child)) {
        return renderList(h, child, serializers)
      } else if (isBlock(child)) {
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
): VNode => {
  return h(
    serializers.styles[block.style || 'normal'],
    { props: { block } },
    renderChildren(h, block, serializers)
  )
}

const renderCustomType = (
  h: CreateElement,
  obj: PortableTextObject,
  serializers: Serializers
): VNode => {
  const serializer = serializers.types[obj._type]
  if (serializer)
    return h(
      serializer,
      { props: { block: obj } },
      renderChildren(h, obj, serializers)
    )

  return h(serializers.styles.normal, {}, renderChildren(h, obj, serializers))
}

export default Vue.extend({
  name: 'VuePortableText',

  props: {
    as: {
      type: String,
      default: undefined,
    },
    blocks: {
      type: Array as PropType<Blocks>,
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
      if (isBlock(block)) {
        return renderBlock(h, block, serializers)
      } else if (isList(block)) {
        return renderList(h, block, serializers)
      } else {
        return renderCustomType(h, block, serializers)
      }
    })

    return h(this.as || serializers.container, {}, children)
  },
})
