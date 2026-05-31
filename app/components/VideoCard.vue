<script setup lang="ts">
import type { VideoPreview } from "~/utils/site";

defineProps<{
  video: VideoPreview;
}>();
</script>

<template>
  <PatternCard :href="video.href" external :aria-label="video.title">
    <div class="relative w-full overflow-hidden rounded-md bg-black pb-[56.25%]">
      <img
        :src="video.thumbnail"
        alt=""
        class="absolute left-0 top-0 h-full w-full object-cover"
      >
    </div>
    <div class="py-2" />
    <h4 class="text-wrap text-lg font-bold">
      <span class="relative inline-block before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-['']">
        {{ video.title }}
      </span>
      <div class="py-1" />
      <p class="text-sm italic">
        <span class="relative inline-block before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-['']">
          <time :datetime="video.date">
            {{ new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(video.date)) }}
          </time>
        </span>
      </p>
    </h4>

    <template v-if="video.external" #overlay>
      <div class="absolute bottom-2 right-2 z-10">
        <TagPill label="external" />
      </div>
    </template>
  </PatternCard>
</template>
