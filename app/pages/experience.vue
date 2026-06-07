<script setup lang="ts">
import { EXPERIENCE_ITEMS } from "~/utils/site";

useSeoMeta({
  title: "Experience",
  description: "Professional experience for Colin Clisson.",
});
</script>

<template>
  <section>
    <PageBreadcrumbs
      :items="[{ href: '/', label: 'Home' }]"
      current="Experience"
    />
    <hr />
    <article class="prose">
      <p>
        I build user-facing products and AI-enabled systems across consulting,
        education, and client-services environments.
      </p>
      <div class="not-prose text-black">
        <ol class="relative flex max-w-2xl flex-col gap-y-8">
          <li
            v-for="experience in EXPERIENCE_ITEMS"
            :key="experience.company"
            class="relative grid sm:grid-cols-[2rem_minmax(0,1fr)] sm:gap-x-4"
          >
            <div
              class="relative hidden justify-center sm:flex"
              aria-hidden="true"
            >
              <div class="absolute -bottom-8 top-0 w-px bg-black" />
              <div
                class="relative z-10 mt-5 size-4 rounded-full border-2 border-black bg-white shadow-[0_0_0_0.35rem_white]"
              />
            </div>
            <div class="min-w-0">
              <p class="mb-2 text-xs italic text-gray-600">
                <span class="text-white-backdrop">{{ experience.period }}</span>
              </p>
              <ExperienceCard :experience="experience" />
            </div>
          </li>
        </ol>
      </div>
    </article>
  </section>
</template>
