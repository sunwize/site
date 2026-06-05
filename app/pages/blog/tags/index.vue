<script setup lang="ts">
type TagPostCount = {
  tag: string;
  count: number;
};

const { data: tags } = await useAsyncData("blog-tags", async () => {
  const allPosts = await queryCollection("blog").all();
  const countsByTag = new Map<string, number>();

  for (const post of allPosts) {
    if (post.draft) {
      continue;
    }

    for (const tag of post.tags ?? []) {
      countsByTag.set(tag, (countsByTag.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(countsByTag, ([tag, count]): TagPostCount => ({ tag, count }))
    .toSorted((a, b) => a.tag.localeCompare(b.tag));
});

useSeoMeta({
  title: "Blog - Tags",
  description: "All tags used in blog posts.",
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Blog - Tags</h1>
    <hr />
    <div class="flex flex-col gap-y-3">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.tag"
        :to="`/blog/tags/${tag.tag}`"
        class="focus-ring text-xl underline md:no-underline md:hover:underline"
      >
        {{ tag.tag }} ({{ tag.count }})
      </NuxtLink>
    </div>
  </section>
</template>
