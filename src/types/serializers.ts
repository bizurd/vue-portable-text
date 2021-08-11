import { Component } from 'vue'

export interface Serializers {
  types: Record<string, string | Component>
  marks: Record<string, string | Component>
  styles: Record<string, string | Component>
  list: {
    number: string | Component
    bullet: string | Component
  }
  listItem: string | Component
  container: string | Component
}
