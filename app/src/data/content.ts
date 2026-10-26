import type { Highlight } from '@/types/content'

export const APP_NAME = 'Eulino'
export const MASCOT_NAME = 'Elly'
export const DEVELOPER_NAME = 'Michael Schreiber'
export const DEVELOPER_URL = 'https://www.michaelschreiber.net'
export const IMPRINT_URL = 'https://www.michaelschreiber.net/#/imprint'

export const hero = {
  eyebrow: 'Coming soon',
  title: 'Learning is more fun',
  titleHighlight: 'with a buddy',
  lead: 'Eulino is a voice-based learning companion for children. Elly the owl listens, explains and asks questions – a real conversation, without typing.',
  status: 'We are putting the finishing touches on the app.',
} as const

export const highlights: readonly Highlight[] = [
  {
    id: 'talk',
    title: 'Talk instead of type',
    text: 'Children simply ask their questions out loud.',
  },
  {
    id: 'lessons',
    title: 'Guided lessons',
    text: 'Elly tells exciting facts on a topic and answers every question.',
  },
  {
    id: 'privacy',
    title: 'Listens only on request',
    text: 'The microphone is only used during a session.',
  },
]
