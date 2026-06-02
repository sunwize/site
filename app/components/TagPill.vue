<script setup lang="ts">
defineProps<{
  label: string;
  href?: string;
  active?: boolean;
}>();
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="text-white-backdrop rounded-xl border border-black px-1 text-sm hover:bg-black hover:text-white hover:before:bg-transparent"
    :class="{ 'bg-black text-white before:bg-transparent': active }"
  >
    {{ label }}
  </NuxtLink>
  <span
    v-else
    class="text-white-backdrop rounded-xl border border-black px-1 text-sm"
    :class="{ 'bg-black text-white before:bg-transparent': active }"
  >
    {{ label }}
  </span>
</template>
