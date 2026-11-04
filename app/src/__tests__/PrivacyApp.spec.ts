/*
 * Testing concept (EDU-45, `PrivacyApp.vue`): page-level component test in jsdom. It proves the
 * wiring of the page: one h1, header/main/footer, the language links pointing at the article
 * anchors with matching hreflang/lang, both articles in order, unique heading ids (anchors work)
 * and alt attributes on images. Layout and responsiveness are manual browser checks.
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PrivacyApp from '../PrivacyApp.vue'

describe('PrivacyApp', () => {
  it('renders exactly one h1 with the bilingual page title', () => {
    const headings = mount(PrivacyApp).findAll('h1')

    expect(headings).toHaveLength(1)
    expect(headings[0]!.text()).toBe('Privacy notice · Datenschutzhinweis')
  })

  it('renders header, main content and footer', () => {
    const wrapper = mount(PrivacyApp)

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('links each language to its article with hreflang and lang', () => {
    const links = mount(PrivacyApp).findAll('nav.privacy__languages a')

    expect(
      links.map((a) => [a.text(), a.attributes('href'), a.attributes('hreflang'), a.attributes('lang')]),
    ).toEqual([
      ['English', '#en', 'en', 'en'],
      ['Deutsch', '#de', 'de', 'de'],
    ])
  })

  it('renders the English article before the German one, each with its lang', () => {
    const articles = mount(PrivacyApp).findAll('article')

    expect(articles.map((a) => [a.attributes('id'), a.attributes('lang')])).toEqual([
      ['en', 'en'],
      ['de', 'de'],
    ])
  })

  it('uses unique element ids on the page', () => {
    const ids = mount(PrivacyApp)
      .findAll('[id]')
      .map((el) => el.attributes('id'))

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every image an alt attribute', () => {
    const images = mount(PrivacyApp).findAll('img')

    expect(images.map((img) => img.attributes('alt'))).not.toContain(undefined)
  })
})
