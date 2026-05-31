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
    class="text-white-backdrop rounded-xl border border-black px-1 text-sm hover:bg-black hover:text-white hover:before:bg-transparent"
  >
    {{ label }}
  </component>
</template>
