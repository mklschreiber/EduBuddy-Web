import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SiteFooter from '../components/SiteFooter.vue'

describe('SiteFooter', () => {
  it('shows the links Privacy, Imprint and Developer in this order', () => {
    const wrapper = mount(SiteFooter)

    expect(wrapper.findAll('nav a').map((a) => a.text())).toEqual([
      'Privacy',
      'Imprint',
      'Developer',
    ])
  })

  it('links to the privacy page in the same tab', () => {
    const wrapper = mount(SiteFooter)

    const link = wrapper.findAll('a').find((a) => a.text() === 'Privacy')!
    expect(link.attributes('href')).toBe('/privacy/')
    expect(link.attributes('target')).toBeUndefined()
    expect(link.attributes('rel')).toBeUndefined()
  })

  it('links to the imprint in a new tab', () => {
    const wrapper = mount(SiteFooter)

    const link = wrapper.findAll('a').find((a) => a.text() === 'Imprint')!
    expect(link.attributes('href')).toBe('https://www.michaelschreiber.net/#/imprint')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
  })

  it('shows the copyright with the current year', () => {
    const wrapper = mount(SiteFooter)

    expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} Michael Schreiber`)
  })
})
