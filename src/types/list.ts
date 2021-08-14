import { ListItem } from './listItem'
import { isPortableTextObject, PortableTextObject } from './portableTextObject'

export interface List extends PortableTextObject {
  _type: 'list'
  children?: ListItem[]
  list?: string
}

export function isList(obj: unknown): obj is List {
  return isPortableTextObject(obj) && obj._type === 'list'
}
