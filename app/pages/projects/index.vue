<script setup lang="ts">
import { sortByPubDateDesc, toProjectPreview } from "~/utils/content";

const { data: projects } = await useAsyncData("projects", async () => {
  const allProjects = await queryCollection("projects").all();
  return sortByPubDateDesc(allProjects.filter((project) => !project.draft)).map(
    toProjectPreview
  );
});

useSeoMeta({
  title: "Projects",
  description: "Projects by Colin Clisson.",
});
</script>

<template>
  <section>
    <h1 class="text-4xl font-bold">Projects</h1>
    <hr />
    <h2 class="sr-only">All projects</h2>
    <div class="text-black">
      <ul class="flex flex-col items-start gap-y-5">
        <li
          v-for="project in projects"
          :key="project.href"
          class="w-full max-w-96"
        >
          <ProjectCard :project="project" />
        </li>
      </ul>
    </div>
  </section>
</template>
