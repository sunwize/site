<script setup lang="ts">
const route = useRoute();
const title = String(route.params.slug ?? "Project");

useSeoMeta({
  title,
  description: "Project details.",
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">{{ title }}</h1>
    <hr />
    <article class="prose">
      <p>Project details will live here.</p>
    </article>
  </section>
</template>
