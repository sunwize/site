<script setup lang="ts">
defineProps<{
  label: string;
  alwaysVisible?: boolean;
}>();
</script>

<template>
  <span
    class="group/underline relative inline-block cursor-pointer decoration-0"
    :class="{ 'is-visible': alwaysVisible }"
  >
    <span>{{ label }}</span>
    <span
      class="absolute left-1/2 block h-[0.12em] w-0 -translate-x-1/2 bg-current transition-[width] duration-200 ease-out bottom-[-0.08em] group-hover/underline:w-full group-[.is-visible]/underline:w-full"
      aria-hidden="true"
    />
  </span>
</template>
