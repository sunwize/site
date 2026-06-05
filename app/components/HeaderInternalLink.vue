<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <NuxtLink
    :to="href"
    class="focus-ring underline md:no-underline"
    active-class="font-semibold"
  >
    <AnimatedUnderline :label="label" always-show-on-mobile />
  </NuxtLink>
</template>
