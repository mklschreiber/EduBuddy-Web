/*
 * Testing concept (EDU-45, `SiteHeader.vue`): the logo is the way back home from the privacy page,
 * so it must be wrapped in a link to the base URL whose accessible name is the app name.
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SiteHeader from '../components/SiteHeader.vue'

describe('SiteHeader', () => {
  it('links the logo to the home page', () => {
    const link = mount(SiteHeader).find('header a')

    expect(link.attributes('href')).toBe('/')
    expect(link.find('.app-logo').exists()).toBe(true)
    expect(link.text()).toBe('Eulino')
  })
})
