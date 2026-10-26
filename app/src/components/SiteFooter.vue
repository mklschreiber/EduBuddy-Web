<script setup lang="ts">
import { DEVELOPER_NAME, DEVELOPER_URL, IMPRINT_URL } from '@/data/content'
import AppLogo from './AppLogo.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div class="site-footer__brand">
        <AppLogo :size="28" />
        <p>© {{ year }} {{ DEVELOPER_NAME }}</p>
      </div>
      <nav class="site-footer__links" aria-label="Footer">
        <a :href="IMPRINT_URL" target="_blank" rel="noopener noreferrer">Imprint</a>
        <a :href="DEVELOPER_URL" target="_blank" rel="noopener noreferrer">Developer</a>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding-block: 32px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-subtle);
  font-size: 0.9375rem;
}

.site-footer__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.site-footer__brand {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  color: var(--color-text-muted);
}

.site-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
}

.site-footer__links a {
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__links a:hover {
  color: var(--color-text);
}
</style>
