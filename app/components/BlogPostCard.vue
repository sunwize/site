<script setup lang="ts">
import type { BlogPostPreview } from "~/utils/site";

defineProps<{
  post: BlogPostPreview;
}>();
</script>

<template>
  <PatternCard :href="post.href" :aria-label="post.title">
    <h4 class="text-wrap text-lg font-bold">
      <span class="relative inline-block before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-['']">
        {{ post.title }}
      </span>
    </h4>
    <div class="py-1" />
    <p class="text-sm italic">
      <span class="relative inline-block before:absolute before:inset-0 before:-z-10 before:bg-white before:blur-[0.5em] before:content-['']">
        <time :datetime="post.date">
          {{ new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(post.date)) }}
        </time>
      </span>
    </p>

    <template v-if="post.tags?.length" #overlay>
      <div class="absolute bottom-2 right-2 z-10 flex gap-1">
        <TagPill
          v-for="tag in post.tags"
          :key="tag"
          :label="tag"
          :href="`/blog/tags/${tag}`"
        />
      </div>
    </template>
  </PatternCard>
</template>
