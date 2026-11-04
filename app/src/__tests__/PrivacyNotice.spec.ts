/*
 * Testing concept (EDU-45, `PrivacyNotice.vue`): component tests in jsdom with each real notice.
 * They prove the rendering contract the page and the anchor links rely on: article id/lang,
 * the date as <time datetime>, one h3 per section with the id `${lang}-${sectionId}` in order,
 * every block type rendered, and the link rules (external links open in a new tab with
 * rel="noopener", mailto/tel links stay in the same tab).
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import PrivacyNotice from '../components/PrivacyNotice.vue'
import { PRIVACY_LAST_UPDATED, privacyNotices } from '../data/privacy'
import type { PrivacyNotice as Notice } from '../types/privacy'

const mountNotice = (notice: Notice) => mount(PrivacyNotice, { props: { notice } })

const listItems = (notice: Notice): string[] =>
  notice.sections.flatMap((s) => s.blocks).flatMap((b) => (b.type === 'list' ? b.items : []))

const addressLines = (notice: Notice): string[] =>
  notice.sections.flatMap((s) => s.blocks).flatMap((b) => (b.type === 'address' ? b.lines : []))

const linkBlocks = (notice: Notice) =>
  notice.sections.flatMap((s) => s.blocks).flatMap((b) => (b.type === 'link' ? [b] : []))

const localLinkCount = (notice: Notice): number =>
  linkBlocks(notice).filter((b) => !b.link.href.startsWith('https://')).length

const paragraphCount = (notice: Notice): number =>
  notice.sections
    .flatMap((s) => s.blocks)
    .filter((b) => b.type === 'paragraph' || b.type === 'link').length

describe.each(privacyNotices.map((notice) => ({ lang: notice.lang, notice })))(
  'PrivacyNotice ($lang)',
  ({ lang, notice }) => {
    it('renders an article with the language as id and lang', () => {
      const article = mountNotice(notice).find('article')

      expect(article.attributes('id')).toBe(lang)
      expect(article.attributes('lang')).toBe(lang)
      expect(article.attributes('aria-labelledby')).toBe(`${lang}-title`)
    })

    it('renders the title as h2 and the last-updated date as a time element', () => {
      const wrapper = mountNotice(notice)

      expect(wrapper.find('h2').attributes('id')).toBe(`${lang}-title`)
      expect(wrapper.find('h2').text()).toBe(notice.title)
      const time = wrapper.find('time')
      expect(time.attributes('datetime')).toBe(PRIVACY_LAST_UPDATED)
      expect(time.text()).toBe(notice.updated)
    })

    it('renders one h3 per section in order with the anchor id lang-sectionId', () => {
      const headings = mountNotice(notice).findAll('h3')

      expect(headings.map((h) => h.attributes('id'))).toEqual(
        notice.sections.map((s) => `${lang}-${s.id}`),
      )
      expect(headings.map((h) => h.text())).toEqual(notice.sections.map((s) => s.title))
    })

    it('renders every list item and address line', () => {
      const wrapper = mountNotice(notice)

      expect(wrapper.findAll('li').map((li) => li.text())).toEqual(listItems(notice))
      expect(wrapper.findAll('.privacy-notice__line').map((l) => l.text())).toEqual(
        addressLines(notice),
      )
    })

    it('renders paragraphs and link blocks as paragraphs inside the sections', () => {
      const wrapper = mountNotice(notice)

      expect(wrapper.findAll('section p')).toHaveLength(paragraphCount(notice))
    })

    it('opens external links in a new tab without opener', () => {
      const external = mountNotice(notice).findAll('a[href^="https://"]')

      expect(external.length).toBeGreaterThan(0)
      expect(external.map((a) => a.attributes('target'))).toEqual(external.map(() => '_blank'))
      expect(external.map((a) => a.attributes('rel'))).toEqual(
        external.map(() => expect.stringContaining('noopener')),
      )
    })

    it('keeps mailto and tel links in the same tab', () => {
      const local = mountNotice(notice).findAll('a[href^="mailto:"], a[href^="tel:"]')

      expect(local).toHaveLength(localLinkCount(notice))
      expect(local.map((a) => a.attributes('target'))).toEqual(local.map(() => undefined))
      expect(local.map((a) => a.attributes('rel'))).toEqual(local.map(() => undefined))
    })

    it('separates the prefix of a link block from the link with a space', () => {
      const paragraphs = mountNotice(notice).findAll('section p:has(> a)')

      expect(paragraphs.map((p) => p.text())).toEqual(
        linkBlocks(notice).map((b) => (b.prefix ? `${b.prefix} ${b.link.label}` : b.link.label)),
      )
    })
  },
)
