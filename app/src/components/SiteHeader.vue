<script setup lang="ts">
import AppLogo from './AppLogo.vue'
</script>

<template>
  <header class="site-header">
    <div class="container">
      <AppLogo />
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
</style>
