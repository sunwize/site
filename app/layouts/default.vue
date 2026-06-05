<script setup lang="ts">
import {
  SITE_DESCRIPTION,
  SITE_PREVIEW_IMAGE,
  SITE_TITLE,
  SITE_URL,
} from "~/utils/site";

const siteUrl = SITE_URL.replace(/\/$/, "");
const previewImage = siteUrl
  ? `${siteUrl}${SITE_PREVIEW_IMAGE}`
  : SITE_PREVIEW_IMAGE;

useHead({
  link: [
    {
      rel: "preload",
      href: "/fonts/BerkeleyMonoVariable-Regular.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "",
    },
    {
      rel: "preload",
      href: "/fonts/BerkeleyMonoVariable-Italic.woff2",
      as: "font",
      type: "font/woff2",
      crossorigin: "",
    },
  ],
});

useSeoMeta({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ogTitle: SITE_TITLE,
  ogDescription: SITE_DESCRIPTION,
  ogImage: previewImage,
  ogImageWidth: 1254,
  ogImageHeight: 1254,
  ogImageType: "image/jpeg",
  twitterCard: "summary_large_image",
  twitterImage: previewImage,
});
</script>

<template>
  <div class="flex min-h-screen w-full flex-col p-4 font-normal md:px-10 md:py-5">
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <div class="md:hidden">
      <HorizontalHeader />
      <div class="py-4" />
    </div>
    <div class="grow md:flex">
      <aside class="hidden md:block md:w-1/4">
        <VerticalHeader />
      </aside>
      <main id="main-content" class="w-full md:w-3/4 md:max-w-2xl" tabindex="-1">
        <slot />
      </main>
    </div>
    <div class="py-7" />
    <SiteFooter />
  </div>
</template>
