<script setup lang="ts">
import type { ProjectPreview } from "~/utils/site";
import { toViewTransitionName } from "~/utils/viewTransitions";

defineProps<{
  project: ProjectPreview;
}>();

const viewTransitionNameForProject = (project: ProjectPreview, part: string) =>
  toViewTransitionName("projects", project.href, part);
</script>

<template>
  <PatternCard
    :href="project.href"
    :external="project.href.startsWith('http')"
    :aria-label="project.title"
    :style="{
      viewTransitionName: viewTransitionNameForProject(project, 'card'),
    }"
  >
    <div
      class="relative w-full overflow-hidden rounded-md bg-white pb-[56.25%]"
      :style="{
        viewTransitionName: viewTransitionNameForProject(project, 'thumbnail'),
      }"
    >
      <img
        :src="project.thumbnail"
        alt=""
        class="absolute left-0 top-0 h-full w-full object-cover"
      />
    </div>
    <div class="py-2" />
    <h4 class="text-wrap text-lg font-bold">
      <span
        class="text-white-backdrop"
        :style="{
          viewTransitionName: viewTransitionNameForProject(project, 'title'),
        }"
      >
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
