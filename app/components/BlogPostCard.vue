<script setup lang="ts">
import { formatPostDate } from "~/utils/content";
import type { BlogPostPreview } from "~/utils/site";

defineProps<{
  post: BlogPostPreview;
}>();
</script>

<template>
  <PatternCard :href="post.href" :aria-label="post.title">
    <h4 class="text-wrap text-lg font-bold">
      <span class="text-white-backdrop">
        {{ post.title }}
      </span>
    </h4>
    <div class="py-1" />
    <p class="text-sm italic">
      <span class="text-white-backdrop">
        <time :datetime="post.date">
          {{ formatPostDate(post.date) }}
        </time>
      </span>
    </p>

    <template v-if="post.tags?.length" #overlay>
      <TagRow :tags="post.tags" class="absolute bottom-2 right-2 z-10" />
    </template>
  </PatternCard>
</template>
