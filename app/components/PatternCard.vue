<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const {
  href,
  external = false,
  ariaLabel,
} = defineProps<{
  href?: string;
  external?: boolean;
  ariaLabel?: string;
}>();

const isInternalLink = computed(() => href && !external);
</script>

<template>
  <div class="relative">
    <NuxtLink
      v-if="isInternalLink"
      :to="href as RouteLocationRaw"
      :aria-label="ariaLabel"
      prefetch-on="interaction"
      class="focus-ring peer block rounded-md"
    >
      <div class="relative overflow-hidden rounded-md border-2 border-black">
        <div
          class="relative z-10 flex h-full w-full flex-col items-start bg-white bg-dots p-3"
        >
          <slot />
        </div>
      </div>
    </NuxtLink>
    <a
      v-else-if="href"
      :href="href"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      :aria-label="ariaLabel"
      class="focus-ring peer block rounded-md"
    >
      <div class="relative overflow-hidden rounded-md border-2 border-black">
        <div
          class="relative z-10 flex h-full w-full flex-col items-start bg-white bg-dots p-3"
        >
          <slot />
        </div>
      </div>
    </a>
    <div v-else :aria-label="ariaLabel" class="peer block">
      <div class="relative overflow-hidden rounded-md border-2 border-black">
        <div
          class="relative z-10 flex h-full w-full flex-col items-start bg-white bg-dots p-3"
        >
          <slot />
        </div>
      </div>
    </div>
    <div
      class="absolute left-[0.5em] top-[0.5em] -z-10 h-full w-full rounded-md bg-hatch transition-all duration-300 peer-hover:left-[0.75em] peer-hover:top-[0.75em]"
      aria-hidden="true"
    />
    <slot name="overlay" />
  </div>
</template>
