<script setup lang="ts">
import { sortBlogPostsByPubDateDesc, toBlogPostPreview } from "~/utils/content";

const route = useRoute();
const tag = String(route.params.tag ?? "");

const { data: posts } = await useAsyncData(`blog-tag-${tag}`, async () => {
  const allPosts = await queryCollection("blog").all();
  return sortBlogPostsByPubDateDesc(
    allPosts.filter((post) => !post.draft && post.tags.includes(tag))
  ).map(toBlogPostPreview);
});

useSeoMeta({
  title: `Tag: ${tag}`,
  description: `Articles tagged ${tag}.`,
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Tag: {{ tag }}</h1>
    <hr />
    <div class="text-black">
      <ul class="flex flex-col items-start gap-y-5">
        <li v-for="post in posts" :key="post.href" class="w-full max-w-96">
          <BlogPostCard :post="post" />
        </li>
      </ul>
    </div>
  </section>
</template>
