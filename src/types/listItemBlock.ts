import { hasOwnProperty } from '../util/hasOwnProperty'
import { Block } from './block'
import { isPortableTextObject } from './portableTextObject'

export interface ListItemBlock extends Block {
  listItem: string
  level?: number
}

export function isListItemBlock(obj: unknown): obj is ListItemBlock {
  return (
    isPortableTextObject(obj) &&
    hasOwnProperty(obj, 'listItem') &&
    typeof obj.listItem === 'string'
  )
}
