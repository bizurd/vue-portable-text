import { hasOwnProperty } from '../util/hasOwnProperty'

export interface PortableTextObject {
  _type: string
  children?: PortableTextObject[]
  [x: string]: unknown
}

export function isPortableTextObject(obj: unknown): obj is PortableTextObject {
  return !!obj && hasOwnProperty(obj, '_type') && typeof obj._type === 'string'
}
