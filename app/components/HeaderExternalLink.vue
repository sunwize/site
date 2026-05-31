<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a
    :href="href"
    class="group relative max-w-22 -skew-y-5 overflow-hidden bg-black px-1 text-white transition duration-500 ease-out hover:bg-white hover:text-black xs:max-w-24"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span class="inline-block skew-y-5 p-[0.1rem] transition-transform duration-500 group-hover:skew-y-10">
      <ScrambleText :text="label" :max-iterations="5" />
    </span>
  </a>
</template>
