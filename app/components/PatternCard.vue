<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string;
    external?: boolean;
    ariaLabel?: string;
  }>(),
  {
    href: undefined,
    external: false,
    ariaLabel: undefined,
  },
);
</script>

<template>
  <div class="relative">
    <component
      :is="href ? 'a' : 'div'"
      :href="href"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      :aria-label="ariaLabel"
      class="peer block"
    >
      <div class="relative overflow-hidden rounded-md border-2 border-black">
        <div class="relative z-10 flex h-full w-full flex-col items-start bg-white bg-dots p-3">
          <slot />
        </div>
      </div>
    </component>
    <div
      class="absolute left-[0.5em] top-[0.5em] -z-10 h-full w-full rounded-md bg-hatch transition-[top] duration-300 peer-hover:-top-[0.5em]"
      aria-hidden="true"
    />
    <slot name="overlay" />
  </div>
</template>
