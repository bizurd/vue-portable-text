import { isPortableTextObject, PortableTextObject } from './portableTextObject'

export interface Span extends PortableTextObject {
  _type: 'span'
  marks: string[]
  text: string
}

export function isSpan(obj: unknown): obj is Span {
  return isPortableTextObject(obj) && obj._type === 'span'
}
