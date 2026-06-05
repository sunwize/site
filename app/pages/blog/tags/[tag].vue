<script setup lang="ts">
import { sortByPubDateDesc, toBlogPostPreview } from "~/utils/content";
import { toViewTransitionName } from "~/utils/viewTransitions";

const route = useRoute();
const tag = String(route.params.tag ?? "");
const viewTransitionName = toViewTransitionName("blog", "tag", tag, "title");

const { data: posts } = await useAsyncData(`blog-tag-${tag}`, async () => {
  const allPosts = await queryCollection("blog").all();
  return sortByPubDateDesc(
    allPosts.filter((post) => !post.draft && post.tags.includes(tag))
  ).map(toBlogPostPreview);
});

useSeoMeta({
  title: `Blog - ${tag}`,
  description: `Articles tagged ${tag}.`,
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold" :style="{ viewTransitionName }">
      Blog - {{ tag }}
    </h1>
    <div class="py-1"></div>
    <NuxtLink
      to="/blog/tags"
      class="focus-ring underline md:no-underline md:hover:underline"
    >
      See all tags
    </NuxtLink>
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
