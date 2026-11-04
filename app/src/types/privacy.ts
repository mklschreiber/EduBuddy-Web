export type PrivacyLanguage = 'en' | 'de'

export interface PrivacyLink {
  label: string
  href: string
}

export type PrivacyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: readonly string[] }
  | { type: 'address'; lines: readonly string[] }
  | { type: 'link'; prefix?: string; link: PrivacyLink }

export interface PrivacySection {
  /** Stable id, identical in both languages; the heading id is `${lang}-${id}`. */
  id: string
  title: string
  blocks: readonly PrivacyBlock[]
}

export interface PrivacyNotice {
  lang: PrivacyLanguage
  /** The language's own name, for the language links ("English", "Deutsch"). */
  languageName: string
  title: string
  /** Displayed date line, e.g. "Last updated: 4 November 2026". */
  updated: string
  intro: string
  sections: readonly PrivacySection[]
}
