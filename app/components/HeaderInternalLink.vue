<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <NuxtLink :to="href" class="underline md:no-underline">
    <AnimatedUnderline :label="label" always-visible />
  </NuxtLink>
</template>
