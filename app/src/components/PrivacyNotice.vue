<script setup lang="ts">
import { PRIVACY_LAST_UPDATED } from '@/data/privacy'
import type { PrivacyNotice } from '@/types/privacy'

defineProps<{ notice: PrivacyNotice }>()

const isExternal = (href: string): boolean => href.startsWith('https://')
</script>

<template>
  <article
    :id="notice.lang"
    :lang="notice.lang"
    class="privacy-notice"
    :aria-labelledby="`${notice.lang}-title`"
  >
    <h2 :id="`${notice.lang}-title`">{{ notice.title }}</h2>
    <p class="privacy-notice__updated">
      <time :datetime="PRIVACY_LAST_UPDATED">{{ notice.updated }}</time>
    </p>
    <p class="privacy-notice__intro">{{ notice.intro }}</p>
    <section
      v-for="s in notice.sections"
      :key="s.id"
      :class="['privacy-notice__section', `privacy-notice__section--${s.id}`]"
      :aria-labelledby="`${notice.lang}-${s.id}`"
    >
      <h3 :id="`${notice.lang}-${s.id}`">{{ s.title }}</h3>
      <template v-for="(block, index) in s.blocks" :key="index">
        <p v-if="block.type === 'paragraph'">{{ block.text }}</p>
        <ul v-else-if="block.type === 'list'">
          <li v-for="item in block.items" :key="item">{{ item }}</li>
        </ul>
        <address v-else-if="block.type === 'address'">
          <span v-for="line in block.lines" :key="line" class="privacy-notice__line">{{
            line
          }}</span>
        </address>
        <p v-else-if="block.type === 'link'">
          <template v-if="block.prefix">{{ `${block.prefix} ` }}</template>
          <a
            :href="block.link.href"
            :target="isExternal(block.link.href) ? '_blank' : undefined"
            :rel="isExternal(block.link.href) ? 'noopener noreferrer' : undefined"
            >{{ block.link.label }}</a
          >
        </p>
      </template>
    </section>
  </article>
</template>

<style scoped>
.privacy-notice {
  margin-top: 48px;
  color: var(--color-text-muted);
  scroll-margin-top: 24px;
}

.privacy-notice + .privacy-notice {
  margin-top: 72px;
  padding-top: 48px;
  border-top: 1px solid var(--color-border);
}

.privacy-notice h2 {
  color: var(--color-text);
  font-size: clamp(1.5rem, 3.5vw, 2rem);
}

.privacy-notice h3 {
  margin-top: 40px;
  color: var(--color-text);
  font-size: 1.25rem;
  scroll-margin-top: 24px;
}

.privacy-notice p,
.privacy-notice ul,
.privacy-notice address {
  margin: 12px 0 0;
}

.privacy-notice ul {
  padding-left: 1.25em;
}

.privacy-notice li {
  margin-top: 6px;
}

.privacy-notice address {
  font-style: normal;
}

.privacy-notice__line {
  display: block;
}

.privacy-notice a {
  color: var(--color-brand-light);
  text-decoration: underline;
  overflow-wrap: anywhere;
}

.privacy-notice__updated {
  color: var(--color-text-subtle);
  font-size: 0.9375rem;
}

.privacy-notice__section--in-short {
  margin-top: 32px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
}

.privacy-notice__section--in-short h3 {
  margin-top: 0;
}
</style>
