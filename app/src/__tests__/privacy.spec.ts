/*
 * Testing concept (EDU-45, data module `src/data/privacy.ts`):
 * The copy itself is approved in the architecture concept, so these tests do not compare texts
 * 1:1 (no mirror tests). They guard the structural rules that keep both languages in sync and
 * the acceptance criteria that a later edit could silently break: same section ids and order in
 * English and German, no internal codename, no placeholders, no model names, the required Google
 * links, the controller data and a consistent "last updated" date. Plain unit tests (no DOM).
 */
import { describe, expect, it } from 'vitest'

import { PRIVACY_LAST_UPDATED, privacyNotices } from '../data/privacy'
import type { PrivacyBlock, PrivacyLink, PrivacyNotice } from '../types/privacy'

const [english, german] = privacyNotices as [PrivacyNotice, PrivacyNotice]

const blockStrings = (block: PrivacyBlock): string[] => {
  switch (block.type) {
    case 'paragraph':
      return [block.text]
    case 'list':
      return [...block.items]
    case 'address':
      return [...block.lines]
    case 'link':
      return [block.prefix ?? '', block.link.label, block.link.href]
  }
}

const allStrings = (notice: PrivacyNotice): string[] => [
  notice.languageName,
  notice.title,
  notice.updated,
  notice.intro,
  ...notice.sections.flatMap((s) => [s.id, s.title, ...s.blocks.flatMap(blockStrings)]),
]

const allText = (notice: PrivacyNotice): string => allStrings(notice).join('\n')

const allLinks = (notice: PrivacyNotice): PrivacyLink[] =>
  notice.sections
    .flatMap((s) => s.blocks)
    .flatMap((b) => (b.type === 'link' ? [b.link] : []))

const sectionIds = (notice: PrivacyNotice): string[] => notice.sections.map((s) => s.id)

const section = (notice: PrivacyNotice, id: string) => notice.sections.find((s) => s.id === id)

const REQUIRED_SECTION_IDS = [
  'in-short',
  'controller',
  'gemini',
  'google',
  'history',
  'pictures',
  'api-key',
  'crash-reports',
  'device-and-backups',
  'deleting',
  'children',
  'website',
  'legal-bases',
  'rights',
  'changes',
]

const sectionText = (notice: PrivacyNotice, id: string): string =>
  section(notice, id)!.blocks.flatMap(blockStrings).join('\n')

const notices = [
  { lang: 'en', notice: english, apple: 'iPhone, iPad and Mac' },
  { lang: 'de', notice: german, apple: 'iPhone, iPad und Mac' },
] as const

const OUTDATED_CRASH_REPORT_PHRASES = [
  'Only the Android app',
  'Nur die Android-App',
  'Share with App Developers',
  'Mit App-Entwicklern teilen',
  'TestFlight',
]

describe('privacy notices', () => {
  it('provides an English and a German notice, English first', () => {
    expect(privacyNotices.map((n) => n.lang)).toEqual(['en', 'de'])
  })

  it('uses the same section ids in the same order in both languages', () => {
    expect(sectionIds(german)).toEqual(sectionIds(english))
  })

  it('uses unique section ids', () => {
    const ids = sectionIds(english)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('contains every required section, starting with "in short" and ending with "changes"', () => {
    const ids = sectionIds(english)

    expect(ids).toEqual(expect.arrayContaining(REQUIRED_SECTION_IDS))
    expect(ids[0]).toBe('in-short')
    expect(ids[ids.length - 1]).toBe('changes')
  })
})

describe.each(notices)('privacy notice ($lang)', ({ lang, notice, apple }) => {
  it('never names the internal codename EduBuddy', () => {
    expect(allText(notice)).not.toMatch(/edubuddy/i)
  })

  it('contains no placeholders or TODOs', () => {
    expect(allText(notice)).not.toMatch(/⟦|⟧|TODO/)
  })

  it('names no model', () => {
    expect(allText(notice)).not.toMatch(/gemini-\d|flash|\bpro\b/i)
  })

  it('names the Gemini Live API', () => {
    expect(allText(notice)).toContain('Gemini Live API')
  })

  it('links the Gemini API terms, the Google privacy policy and the Firebase privacy page', () => {
    const hrefs = allLinks(notice).map((l) => l.href)

    expect(hrefs).toEqual(
      expect.arrayContaining([
        'https://ai.google.dev/gemini-api/terms',
        'https://policies.google.com/privacy',
        'https://firebase.google.com/support/privacy',
      ]),
    )
  })

  it('only uses https, mailto and tel links', () => {
    const hrefs = allLinks(notice).map((l) => l.href)

    expect(hrefs.filter((href) => !/^(https:\/\/|mailto:|tel:)/.test(href))).toEqual([])
  })

  it('states the controller with address and e-mail link', () => {
    const controller = section(notice, 'controller')!
    const lines = controller.blocks.flatMap((b) => (b.type === 'address' ? b.lines : []))
    const hrefs = controller.blocks.flatMap((b) => (b.type === 'link' ? [b.link.href] : []))

    expect(lines).toEqual(
      expect.arrayContaining(['Michael Schreiber', 'Grockelhofen 32', '89340 Leipheim']),
    )
    expect(hrefs).toContain('mailto:info@michaelschreiber.net')
  })

  it('shows the same date as PRIVACY_LAST_UPDATED', () => {
    const date = new Date(`${PRIVACY_LAST_UPDATED}T12:00:00Z`)
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    const month = date.toLocaleString(lang, { month: 'long', timeZone: 'UTC' })

    expect(notice.updated).toContain(String(day))
    expect(notice.updated).toContain(month)
    expect(notice.updated).toContain(String(year))
  })

  it.each(['in-short', 'crash-reports'])('names Firebase Crashlytics in %s', (id) => {
    expect(sectionText(notice, id)).toContain('Firebase Crashlytics')
  })

  it('describes crash reports for all platforms with the 90-day retention', () => {
    const text = sectionText(notice, 'crash-reports')

    expect(text).toContain('Android')
    expect(text).toContain(apple)
    expect(text).toContain('90')
  })

  it.each(OUTDATED_CRASH_REPORT_PHRASES)('no longer says "%s"', (phrase) => {
    expect(allText(notice)).not.toContain(phrase)
  })
})
