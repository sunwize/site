<script setup lang="ts">
import type { ExperienceItem } from "~/utils/site";

defineProps<{
  experience: ExperienceItem;
}>();
</script>

<template>
  <PatternCard>
    <div class="flex w-full flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h3 class="text-wrap text-lg font-bold">
          <span class="text-white-backdrop">{{ experience.company }}</span>
        </h3>
        <p class="text-sm text-gray-700">
          <span class="text-white-backdrop">
            {{ experience.role }} · {{ experience.location }}
          </span>
        </p>
      </div>

      <TagRow :tags="experience.technologies" disabled />

      <ul class="flex list-disc flex-col gap-2 pl-5 text-sm text-gray-800">
        <li v-for="highlight in experience.highlights" :key="highlight">
          <span class="text-white-backdrop">{{ highlight }}</span>
        </li>
      </ul>
    </div>
  </PatternCard>
</template>
