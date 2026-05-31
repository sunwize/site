<script setup lang="ts">
const props = defineProps<{
  tags?: ReadonlyArray<string>;
  highlight?: string;
}>();
</script>

<template>
  <div v-if="props.tags?.length" class="flex flex-wrap gap-1">
    <TagPill
      v-for="tag in props.tags"
      :key="tag"
      :label="tag"
      :href="`/blog/tags/${tag}`"
      :active="highlight === tag"
    />
  </div>
</template>
