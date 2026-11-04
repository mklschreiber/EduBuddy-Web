<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import PrivacyNotice from './components/PrivacyNotice.vue'
import SiteFooter from './components/SiteFooter.vue'
import { PRIVACY_PAGE_TITLE, privacyNotices } from './data/privacy'
</script>

<template>
  <SiteHeader />
  <main class="privacy">
    <div class="container privacy__inner">
      <h1>{{ PRIVACY_PAGE_TITLE }}</h1>
      <nav class="privacy__languages" aria-label="Language / Sprache">
        <a
          v-for="n in privacyNotices"
          :key="n.lang"
          :href="`#${n.lang}`"
          :hreflang="n.lang"
          :lang="n.lang"
          >{{ n.languageName }}</a
        >
      </nav>
      <PrivacyNotice v-for="n in privacyNotices" :key="n.lang" :notice="n" />
    </div>
  </main>
  <SiteFooter />
</template>

<style scoped>
.privacy {
  flex: 1;
  padding-top: clamp(112px, 13vw, 160px);
  padding-bottom: clamp(56px, 8vw, 96px);
}

.privacy__inner {
  max-width: 760px;
}

.privacy h1 {
  color: var(--color-text);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
}

.privacy__languages {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

.privacy__languages a {
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
}

.privacy__languages a:hover {
  background: var(--color-surface-hover);
}
</style>
