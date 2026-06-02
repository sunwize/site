<script setup lang="ts">
import { formatPostDate } from "~/utils/content";
import type { BlogPostPreview } from "~/utils/site";
import { toViewTransitionName } from "~/utils/viewTransitions";

defineProps<{
  post: BlogPostPreview;
}>();

const viewTransitionNameForPost = (post: BlogPostPreview, part: string) =>
  toViewTransitionName("blog", post.href, part);
</script>

<template>
  <PatternCard
    :href="post.href"
    :aria-label="post.title"
    :style="{ viewTransitionName: viewTransitionNameForPost(post, 'card') }"
  >
    <h4 class="text-wrap text-lg font-bold">
      <span
        class="text-white-backdrop"
        :style="{
          viewTransitionName: viewTransitionNameForPost(post, 'title'),
        }"
      >
        {{ post.title }}
      </span>
    </h4>
    <div class="py-1" />
    <p class="text-sm italic">
      <span
        class="text-white-backdrop"
        :style="{ viewTransitionName: viewTransitionNameForPost(post, 'date') }"
      >
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
