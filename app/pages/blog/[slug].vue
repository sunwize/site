<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug;
const path = `/blog/${Array.isArray(slug) ? slug.join("/") : slug}`;

const { data: post } = await useAsyncData(`blog-${path}`, () =>
  queryCollection("blog").path(path).first(),
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
}

useSeoMeta({
  title: () => post.value?.title ?? "Article",
  description: () => post.value?.description ?? undefined,
});
</script>

<template>
  <article v-if="post" class="prose">
    <NuxtLink to="/blog" class="text-sm no-underline">Blog</NuxtLink>
    <div class="py-2" />
    <ContentRenderer :value="post" />
  </article>
</template>
