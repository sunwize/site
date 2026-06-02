<script setup lang="ts">
import {
  sortByPubDateDesc,
  toBlogPostPreview,
  toProjectPreview,
} from "~/utils/content";

const { data: recentPosts } = await useAsyncData(
  "home-recent-posts",
  async () => {
    const allPosts = await queryCollection("blog").all();
    return sortByPubDateDesc(allPosts.filter((post) => !post.draft))
      .slice(0, 3)
      .map(toBlogPostPreview);
  }
);

const { data: recentProjects } = await useAsyncData(
  "home-recent-projects",
  async () => {
    const allProjects = await queryCollection("projects").all();
    return sortByPubDateDesc(allProjects.filter((project) => !project.draft))
      .slice(0, 3)
      .map(toProjectPreview);
  }
);
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Home</h1>
    <hr />
    <article class="prose">
      <h2>About</h2>
      <p>
        Personal site shell in progress. The navigation, typography, layout, and
        interaction primitives are now in place.
      </p>

      <h2>Recent Posts</h2>
      <div class="not-prose text-black">
        <ul class="flex flex-col items-start gap-y-5">
          <li
            v-for="post in recentPosts"
            :key="post.href"
            class="w-full max-w-96"
          >
            <BlogPostCard :post="post" />
          </li>
        </ul>
      </div>

      <h2>Recent Projects</h2>
      <div class="not-prose text-black">
        <ul class="flex flex-col items-start gap-y-5">
          <li
            v-for="project in recentProjects"
            :key="project.href"
            class="w-full max-w-96"
          >
            <ProjectCard :project="project" />
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>
