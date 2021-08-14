import { isPortableTextObject, PortableTextObject } from './portableTextObject'

export interface Block extends PortableTextObject {
  _type: 'block'
  style?: string
}

export function isBlock(obj: unknown): obj is Block {
  return isPortableTextObject(obj) && obj._type === 'block'
}
