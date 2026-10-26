import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { highlights } from '../data/content'

const publicFile = (name: string) => resolve(process.cwd(), 'public', name)

describe('content', () => {
  it('uses unique highlight ids', () => {
    const ids = highlights.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('ships the images the page references', () => {
    expect(existsSync(publicFile('favicon.svg'))).toBe(true)
    expect(existsSync(publicFile('elly.svg'))).toBe(true)
  })
})
