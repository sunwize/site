<script setup lang="ts">
import { sortBlogPostsByPubDateDesc, toBlogPostPreview } from "~/utils/content";

const { data: posts } = await useAsyncData("blog-posts", async () => {
  const allPosts = await queryCollection("blog").all();
  return sortBlogPostsByPubDateDesc(allPosts.filter((post) => !post.draft)).map(
    toBlogPostPreview
  );
});

useSeoMeta({
  title: "Blog",
  description: "Articles and notes by Colin Clisson.",
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Blog</h1>
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
