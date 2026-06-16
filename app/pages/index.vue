<script setup lang="ts">
import {
  sortByPubDateDesc,
  toBlogPostPreview,
  toProjectPreview,
} from "~/utils/content";
import { EXPERIENCE_ITEMS } from "~/utils/site";

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
        I'm a software engineer based in Montreal and working at Ivado Labs,
        where I help our clients leverage AI to improve their business.
      </p>
      <p>
        When I was a kid, I watched the internet revolution happening without
        me. I used to wonder what my life would've looked like if I had been
        part of it. Today, I'm lucky enough to live in the AI era, which is
        arguably an even bigger revolution. But this time, things are different.
        I'm not watching from the bench.
        <strong>I can play the game.</strong>
      </p>

      <h2>Experience</h2>
      <div class="not-prose text-black">
        <ol class="flex flex-col items-start gap-y-5">
          <li
            v-for="experience in EXPERIENCE_ITEMS"
            :key="experience.company"
            class="w-full max-w-2xl"
          >
            <ExperienceCard :experience="experience" />
          </li>
        </ol>
      </div>

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
