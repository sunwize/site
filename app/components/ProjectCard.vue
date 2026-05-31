<script setup lang="ts">
import type { ProjectPreview } from "~/utils/site";

defineProps<{
  project: ProjectPreview;
}>();
</script>

<template>
  <PatternCard :href="project.href" :external="project.href.startsWith('http')" :aria-label="project.title">
    <h4 class="text-wrap text-lg font-bold">
      <span class="relative inline-block before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-['']">
        {{ project.title }}
      </span>
    </h4>
    <div class="py-1" />
    <p class="text-sm">
      {{ project.description }}
    </p>

    <template v-if="project.tags?.length" #overlay>
      <div class="absolute bottom-2 right-2 z-10 flex gap-1">
        <TagPill v-for="tag in project.tags" :key="tag" :label="tag" />
      </div>
    </template>
  </PatternCard>
</template>
