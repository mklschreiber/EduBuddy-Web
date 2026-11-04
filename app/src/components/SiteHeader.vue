<script setup lang="ts">
import AppLogo from './AppLogo.vue'

const homeUrl = import.meta.env.BASE_URL
</script>

<template>
  <header class="site-header">
    <div class="container">
      <a :href="homeUrl" class="site-header__home"><AppLogo /></a>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 1;
  padding-block: 20px;
}

.site-header__home {
  display: inline-flex;
  text-decoration: none;
}
</style>
