<script setup lang="ts">
import { sortBlogPostsByPubDateDesc, toBlogPostPreview } from "~/utils/content";
import type { ProjectPreview, VideoPreview } from "~/utils/site";

const { data: recentPosts } = await useAsyncData("home-recent-posts", async () => {
  const allPosts = await queryCollection("blog").all();
  return sortBlogPostsByPubDateDesc(allPosts.filter((post) => !post.draft))
    .slice(0, 3)
    .map(toBlogPostPreview);
});

const recentVideos: VideoPreview[] = [
  {
    title: "A placeholder video card",
    href: "https://www.youtube.com/",
    date: "2025-08-19",
    thumbnail: "https://i.ytimg.com/vi/wski7bnpW8Y/hqdefault.jpg",
  },
  {
    title: "Another video placeholder",
    href: "https://www.youtube.com/",
    date: "2025-08-04",
    thumbnail: "https://i.ytimg.com/vi/NGBijq6cdfc/hqdefault.jpg",
    external: true,
  },
];

const recentProjects: ProjectPreview[] = [
  {
    title: "Personal Site",
    href: "/projects/personal-site",
    description: "Nuxt 4 rebuild with a compact mono visual system.",
    tags: ["nuxt"],
  },
];
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Home</h1>
    <div class="py-3" />
    <hr>
    <div class="py-3" />
    <article class="prose">
      <h2>About</h2>
      <p>
        Personal site shell in progress. The navigation, typography, layout,
        and interaction primitives are now in place.
      </p>

      <h2>Recent Posts</h2>
      <div class="not-prose text-black">
        <ul class="flex flex-col items-start gap-y-5">
          <li v-for="post in recentPosts" :key="post.href" class="w-full max-w-96">
            <BlogPostCard :post="post" />
          </li>
        </ul>
      </div>

      <h2>Recent Videos</h2>
      <div class="not-prose text-black">
        <ul class="flex flex-col items-start gap-y-5">
          <li v-for="video in recentVideos" :key="video.title" class="w-full max-w-96">
            <VideoCard :video="video" />
          </li>
        </ul>
      </div>

      <h2>Recent Projects</h2>
      <div class="not-prose text-black">
        <ul class="flex flex-col items-start gap-y-5">
          <li v-for="project in recentProjects" :key="project.href" class="w-full max-w-96">
            <ProjectCard :project="project" />
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>
