import { isPortableTextObject, PortableTextObject } from './portableTextObject'

export interface ListItem extends PortableTextObject {
  _type: 'listItem'
  level?: number
  children?: PortableTextObject[]
}

export function isListItem(obj: unknown): obj is ListItem {
  return isPortableTextObject(obj) && obj._type === 'listItem'
}
