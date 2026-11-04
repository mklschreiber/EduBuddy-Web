// @vitest-environment node
/*
 * Testing concept (EDU-45, HTML entries and Vite multi-page build): reads the files with node:fs
 * (cheap, no build). Proves that the privacy entry exists with its own title, description and
 * script, that both entries are part of the build input (otherwise dist/privacy/index.html would
 * be missing and /privacy would 404), and that neither HTML file shows the internal codename.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import viteConfig from '../../vite.config'

const readApp = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8')

const privacyHtml = readApp('privacy/index.html')

describe('HTML entries', () => {
  it('gives the privacy page its own title', () => {
    expect(privacyHtml).toMatch(/<title>[^<]*Privacy notice[^<]*<\/title>/)
  })

  it('gives the privacy page a non-empty meta description', () => {
    expect(privacyHtml).toMatch(/<meta\s+name="description"\s+content="[^"]+"/)
  })

  it('loads the privacy entry script', () => {
    expect(privacyHtml).toContain('<script type="module" src="/src/privacy-main.ts"></script>')
  })

  it.each(['index.html', 'privacy/index.html'])('%s never names EduBuddy', (path) => {
    expect(readApp(path)).not.toMatch(/edubuddy/i)
  })

  it('builds both the home page and the privacy page', () => {
    const input = viteConfig.build?.rollupOptions?.input as Record<string, string>

    expect(input).toEqual({
      main: resolve(process.cwd(), 'index.html'),
      privacy: resolve(process.cwd(), 'privacy/index.html'),
    })
  })
})
