import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SiteFooter from '../components/SiteFooter.vue'

describe('SiteFooter', () => {
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
