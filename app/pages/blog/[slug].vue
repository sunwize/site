<script setup lang="ts">
import { formatPostDate } from "~/utils/content";
import { SITE_TITLE } from "~/utils/site";
import { toViewTransitionName } from "~/utils/viewTransitions";

const route = useRoute();
const slug = route.params.slug;
const path = `/blog/${Array.isArray(slug) ? slug.join("/") : slug}`;
const selectedTag = ref<string>();
const viewTransitionName = (part: string) =>
  toViewTransitionName("blog", path, part);
const titleViewTransitionName = computed(() =>
  selectedTag.value
    ? toViewTransitionName("blog", "tag", selectedTag.value, "title")
    : viewTransitionName("title")
);
const titleElement = useTemplateRef("titleElement");

const selectTag = (tag: string) => {
  const transitionName = toViewTransitionName("blog", "tag", tag, "title");
  selectedTag.value = tag;
  titleElement.value?.style.setProperty("view-transition-name", transitionName);
};

const { data: post } = await useAsyncData(`blog-${path}`, () =>
  queryCollection("blog").path(path).first()
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
}

useSeoMeta({
  title: () =>
    post.value ? `${post.value.title} | ${SITE_TITLE} | Blog` : "Article",
  description: () => post.value?.description ?? undefined,
  robots: () => (post.value?.draft ? "noindex, nofollow" : undefined),
});
</script>

<template>
  <section v-if="post">
    <div
      v-if="post.draft"
      class="mb-6 rounded-lg border-2 border-orange-400 bg-orange-50 p-4"
    >
      <div class="flex items-center gap-3">
        <div class="text-orange-800">
          <p class="font-semibold">This is a draft</p>
          <p class="text-sm">
            Please do not share it. Any feedback is appreciated.
          </p>
        </div>
      </div>
    </div>

    <h1
      ref="titleElement"
      class="text-4xl font-bold"
      :style="{ viewTransitionName: titleViewTransitionName }"
    >
      {{ post.title }}
    </h1>
    <div class="py-1" />
    <time
      :datetime="post.pubDate"
      :style="{ viewTransitionName: viewTransitionName('date') }"
    >
      {{ formatPostDate(post.pubDate) }}
    </time>

    <template v-if="post.updatedDate">
      <div class="py-1" />
      <div>Last updated: {{ formatPostDate(post.updatedDate) }}</div>
    </template>

    <div class="py-1" />
    <TagRow
      :tags="post.tags ?? []"
      :tag-view-transitions="false"
      @select="selectTag"
    />

    <hr />
    <article class="prose">
      <ContentRenderer :value="post" />
    </article>
  </section>
</template>
