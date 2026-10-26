<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import ComingSoonHero from './components/ComingSoonHero.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />
  <main class="main">
    <ComingSoonHero />
  </main>
  <SiteFooter />
</template>

<style scoped>
.main {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
