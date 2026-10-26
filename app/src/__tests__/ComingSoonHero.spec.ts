import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ComingSoonHero from '../components/ComingSoonHero.vue'
import { hero, highlights } from '../data/content'

describe('ComingSoonHero', () => {
  it('announces the app as coming soon', () => {
    const wrapper = mount(ComingSoonHero)

    expect(wrapper.find('.eyebrow').text()).toBe('Coming soon')
    expect(wrapper.text()).toContain(hero.status)
  })

  it('shows Elly with a descriptive alt text', () => {
    const wrapper = mount(ComingSoonHero)

    const img = wrapper.find('.hero__mascot img')
    expect(img.attributes('src')).toBe('/elly.svg')
    expect(img.attributes('alt')).toBe('Elly the owl, the Eulino mascot')
  })

  it('lists every highlight', () => {
    const wrapper = mount(ComingSoonHero)

    const items = wrapper.findAll('.hero__highlight')
    expect(items).toHaveLength(highlights.length)
    items.forEach((item, index) => {
      expect(item.find('h2').text()).toBe(highlights[index]!.title)
    })
  })
})
