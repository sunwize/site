<script setup lang="ts">
defineProps<{
  label: string;
  href?: string;
}>();
</script>

<template>
  <component
    :is="href ? 'a' : 'span'"
    :href="href"
    class="relative inline-block rounded-xl border border-black px-1 text-sm before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-[''] hover:bg-black hover:text-white hover:before:bg-transparent"
  >
    {{ label }}
  </component>
</template>
