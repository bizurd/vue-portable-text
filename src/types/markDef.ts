import { hasOwnProperty } from '../util/hasOwnProperty'

export interface MarkDef {
  _key: string
  _type: string
  [x: string]: unknown
}

export function isMarkDef(obj: unknown): obj is MarkDef {
  return (
    !!obj &&
    hasOwnProperty(obj, '_key') &&
    typeof obj._key === 'string' &&
    hasOwnProperty(obj, '_type') &&
    typeof obj._type === 'string'
  )
}
