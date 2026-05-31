<script setup lang="ts">
import { SITE_DESCRIPTION, SITE_TITLE } from "~/utils/site";

useSeoMeta({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_TITLE,
  ogDescription: SITE_DESCRIPTION,
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="flex min-h-screen w-full flex-col p-4 font-normal md:px-10 md:py-5">
    <div class="md:hidden">
      <HorizontalHeader />
      <div class="py-4" />
    </div>
    <div class="grow md:flex">
      <aside class="hidden md:block md:w-1/4">
        <VerticalHeader />
      </aside>
      <main class="w-full md:w-3/4 md:max-w-2xl">
        <slot />
      </main>
    </div>
    <div class="py-7" />
    <SiteFooter />
  </div>
</template>
