<script setup lang="ts">
import type { ProjectPreview } from "~/utils/site";

defineProps<{
  project: ProjectPreview;
}>();
</script>

<template>
  <PatternCard
    :href="project.href"
    :external="project.href.startsWith('http')"
    :aria-label="project.title"
  >
    <h4 class="text-wrap text-lg font-bold">
      <span class="text-white-backdrop">
        {{ project.title }}
      </span>
    </h4>
    <div class="py-1" />
    <p class="text-sm text-white-backdrop">
      {{ project.description }}
    </p>

    <template v-if="project.tags?.length" #overlay>
      <div class="absolute bottom-2 right-2 z-10 flex gap-1">
        <TagPill v-for="tag in project.tags" :key="tag" :label="tag" />
      </div>
    </template>
  </PatternCard>
</template>
