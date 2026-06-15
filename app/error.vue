<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useSeoMeta({
  title: "404 - Page Not Found",
  description: "404 - Page Not Found",
  robots: "noindex",
});
</script>

<template>
  <NuxtLayout>
    <section>
      <h1 class="text-4xl font-bold md:text-5xl">404 - Page Not Found</h1>
      <hr />
      <NuxtLink
        to="/"
        class="focus-ring underline md:no-underline md:hover:underline"
      >
        <p>Go home</p>
      </NuxtLink>
    </section>
  </NuxtLayout>
</template>
