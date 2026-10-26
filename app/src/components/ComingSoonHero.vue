<script setup lang="ts">
import { APP_NAME, MASCOT_NAME, hero, highlights } from '@/data/content'

const ellyUrl = `${import.meta.env.BASE_URL}elly.svg`
</script>

<template>
  <section class="hero">
    <div class="hero__glow" aria-hidden="true" />
    <div class="container hero__inner">
      <div class="hero__copy">
        <span class="eyebrow">{{ hero.eyebrow }}</span>
        <h1>
          {{ hero.title }} <span class="gradient-text">{{ hero.titleHighlight }}</span>
        </h1>
        <p class="hero__lead">{{ hero.lead }}</p>
        <p class="hero__status">
          <span class="hero__dot" aria-hidden="true" />
          {{ hero.status }}
        </p>
      </div>
      <div class="hero__mascot">
        <img
          :src="ellyUrl"
          :alt="`${MASCOT_NAME} the owl, the ${APP_NAME} mascot`"
          width="740"
          height="560"
        />
      </div>
    </div>
    <ul class="container hero__highlights">
      <li v-for="item in highlights" :key="item.id" class="hero__highlight">
        <h2>{{ item.title }}</h2>
        <p>{{ item.text }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  flex: 1;
  overflow: hidden;
  padding-block: clamp(112px, 13vw, 184px) clamp(56px, 8vw, 96px);
}

.hero__glow {
  position: absolute;
  inset: -20% -10% auto auto;
  width: min(900px, 120vw);
  aspect-ratio: 1;
  /* Each gradient fades out completely inside the box, so no edge of the box is visible. */
  background:
    radial-gradient(ellipse 40% 40% at 58% 45%, rgba(156, 241, 241, 0.2), transparent),
    radial-gradient(ellipse 34% 34% at 42% 60%, rgba(28, 143, 144, 0.38), transparent);
  filter: blur(40px);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  gap: clamp(40px, 6vw, 80px);
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.hero__lead {
  max-width: 560px;
  margin-top: 24px;
  color: var(--color-text-muted);
  font-size: clamp(1.0625rem, 1.6vw, 1.25rem);
}

.hero__status {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 36px;
  padding: 12px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
}

.hero__dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 0 rgba(255, 179, 71, 0.6);
  animation: pulse 2.4s ease-out infinite;
}

.hero__mascot {
  display: flex;
  justify-content: center;
}

.hero__mascot img {
  width: min(440px, 100%);
  height: auto;
  filter: drop-shadow(0 24px 48px rgba(0, 0, 0, 0.45));
  animation: float 7s ease-in-out infinite;
}

.hero__highlights {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  margin-top: clamp(56px, 8vw, 96px);
  margin-bottom: 0;
  list-style: none;
}

.hero__highlight {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  transition: background 0.2s ease;
}

.hero__highlight:hover {
  background: var(--color-surface-hover);
}

.hero__highlight h2 {
  font-size: 1.125rem;
  font-weight: 700;
}

.hero__highlight p {
  margin-top: 8px;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 179, 71, 0.6);
  }
  70%,
  100% {
    box-shadow: 0 0 0 12px rgba(255, 179, 71, 0);
  }
}

@media (max-width: 860px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr);
    text-align: center;
  }

  .hero__mascot {
    order: -1;
  }

  .hero__mascot img {
    width: min(300px, 80%);
  }

  .hero__lead {
    margin-inline: auto;
  }

  .hero__highlights {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
