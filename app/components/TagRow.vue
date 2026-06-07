<script setup lang="ts">
import { toViewTransitionName } from "~/utils/viewTransitions";

const props = defineProps<{
  tags?: ReadonlyArray<string>;
  highlight?: string | undefined;
  tagViewTransitions?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [tag: string];
}>();

const viewTransitionNameForTag = (tag: string) =>
  toViewTransitionName("blog", "tag", tag, "title");
</script>

<template>
  <div v-if="props.tags?.length" class="flex flex-wrap gap-2.5">
    <TagPill
      v-for="tag in props.tags"
      :key="tag"
      :label="tag"
      v-bind="
        props.disabled
          ? {}
          : {
              href: `/blog/tags/${tag}`,
              active: highlight === tag,
            }
      "
      :style="
        props.tagViewTransitions === false
          ? undefined
          : { viewTransitionName: viewTransitionNameForTag(tag) }
      "
      @click="props.disabled ? undefined : emit('select', tag)"
    />
  </div>
</template>
