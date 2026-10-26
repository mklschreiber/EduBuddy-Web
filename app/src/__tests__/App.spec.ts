import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import App from '../App.vue'

describe('App', () => {
  it('renders exactly one h1 with the coming-soon headline', () => {
    const wrapper = mount(App)

    const headings = wrapper.findAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0]!.text()).toBe('Learning is more fun with a buddy')
  })

  it('renders header, main content and footer', () => {
    const wrapper = mount(App)

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('gives every image an alt attribute', () => {
    const wrapper = mount(App)

    for (const img of wrapper.findAll('img')) {
      expect(img.attributes('alt')).toBeDefined()
    }
  })
})
