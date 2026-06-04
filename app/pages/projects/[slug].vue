<script setup lang="ts">
import { formatPostDate } from "~/utils/content";
import { SITE_TITLE } from "~/utils/site";
import { toViewTransitionName } from "~/utils/viewTransitions";

const route = useRoute();
const slug = route.params.slug;
const path = `/projects/${Array.isArray(slug) ? slug.join("/") : slug}`;
const viewTransitionName = (part: string) =>
  toViewTransitionName("projects", path, part);

const { data: project } = await useAsyncData(`project-${path}`, () =>
  queryCollection("projects").path(path).first()
);

if (!project.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project not found",
  });
}

useSeoMeta({
  title: () =>
    project.value
      ? `${project.value.title} | ${SITE_TITLE} | Projects`
      : "Project",
  description: () => project.value?.description ?? undefined,
  robots: () => (project.value?.draft ? "noindex, nofollow" : undefined),
});
</script>

<template>
  <section v-if="project">
    <div
      v-if="project.draft"
      class="mb-6 rounded-lg border-2 border-orange-400 bg-orange-50 p-4"
    >
      <div class="text-orange-800">
        <p class="font-semibold">This is a draft</p>
        <p class="text-sm">
          Please do not share it. Any feedback is appreciated.
        </p>
      </div>
    </div>

    <h1
      class="text-4xl font-bold"
      :style="{ viewTransitionName: viewTransitionName('title') }"
    >
      {{ project.title }}
    </h1>
    <div class="py-1" />
    <time :datetime="project.pubDate">
      {{ formatPostDate(project.pubDate) }}
    </time>

    <template v-if="project.updatedDate">
      <div class="py-1" />
      <div>Last updated: {{ formatPostDate(project.updatedDate) }}</div>
    </template>

    <div class="py-4" />
    <div
      class="overflow-hidden rounded-md border-2 border-black bg-white"
      :style="{ viewTransitionName: viewTransitionName('thumbnail') }"
    >
      <img :src="project.thumbnail" alt="" class="w-full object-cover" />
    </div>

    <div class="py-3" />
    <div class="flex flex-wrap gap-2.5">
      <TagPill v-for="tag in project.tags ?? []" :key="tag" :label="tag" />
    </div>

    <div v-if="project.projectUrl || project.repoUrl" class="py-3" />
    <div
      v-if="project.projectUrl || project.repoUrl"
      class="flex flex-wrap gap-4"
    >
      <a
        v-if="project.projectUrl"
        :href="project.projectUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1 underline md:no-underline md:hover:underline"
      >
        <span>Visit project</span>
        <Icon name="lucide:external-link" style="color: black" />
      </a>
      <a
        v-if="project.repoUrl"
        :href="project.repoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="underline md:no-underline md:hover:underline"
      >
        View source
      </a>
    </div>

    <hr />
    <article class="prose">
      <ContentRenderer :value="project" />
    </article>
  </section>
</template>
