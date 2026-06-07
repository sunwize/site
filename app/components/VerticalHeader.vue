<script setup lang="ts">
import { MAIN_NAV_LINKS, SITE_TITLE, SOCIAL_LINKS } from "~/utils/site";
</script>

<template>
  <nav
    class="md:sticky md:top-5 flex flex-col items-start gap-y-2"
    aria-label="Primary navigation"
  >
    <SitePortrait />
    <div class="py-1" />
    <NuxtLink to="/" class="focus-ring">
      <span class="block text-2xl font-bold">{{ SITE_TITLE }}</span>
    </NuxtLink>
    <div class="py-2" />
    <HeaderInternalLink
      v-for="link in MAIN_NAV_LINKS"
      :key="link.href"
      :href="link.href"
      :label="link.label"
    />
    <div class="py-2" />
    <HeaderExternalLink
      v-for="link in SOCIAL_LINKS"
      :key="link.href"
      :href="link.href"
      :label="link.label"
    />
  </nav>
</template>
