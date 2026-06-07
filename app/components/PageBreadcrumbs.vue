<script setup lang="ts">
import type { StyleValue } from "vue";

defineProps<{
  items: ReadonlyArray<{
    href: string;
    label: string;
  }>;
  current: string;
  currentStyle?: StyleValue;
}>();

const currentElement = useTemplateRef<HTMLHeadingElement>("currentElement");

defineExpose({
  get style() {
    return currentElement.value?.style;
  },
});
</script>

<template>
  <nav aria-label="Breadcrumb" class="mb-1">
    <ol class="flex flex-col items-start gap-y-1">
      <li>
        <ol class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <template v-for="item in items" :key="item.href">
            <li>
              <NuxtLink
                :to="item.href"
                class="focus-ring underline md:no-underline md:hover:underline"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
            <li aria-hidden="true" class="text-gray-500">/</li>
          </template>
        </ol>
      </li>
      <li class="w-full">
        <h1
          ref="currentElement"
          class="text-4xl font-bold"
          aria-current="page"
          :style="currentStyle"
        >
          {{ current }}
        </h1>
      </li>
    </ol>
  </nav>
</template>
