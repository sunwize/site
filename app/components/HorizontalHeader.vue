<script setup lang="ts">
import { MAIN_NAV_LINKS, SITE_TITLE, SOCIAL_LINKS } from "~/utils/site";

const { keyword } = useRandomKeyword();
</script>

<template>
  <nav>
    <div class="flex flex-row justify-between">
      <div class="flex flex-col items-start">
        <NuxtLink to="/">
          <h1 class="min-w-max text-2xl font-bold">{{ SITE_TITLE }}</h1>
        </NuxtLink>
        <h2 class="text-center italic">{{ keyword }}</h2>
      </div>
      <div class="flex w-full flex-wrap justify-end text-right">
        <div class="flex w-full justify-end gap-x-2">
          <HeaderInternalLink
            v-if="MAIN_NAV_LINKS[0]"
            :href="MAIN_NAV_LINKS[0].href"
            :label="MAIN_NAV_LINKS[0].label"
          />
        </div>
        <div class="flex w-full justify-end gap-x-2">
          <HeaderInternalLink
            v-for="link in MAIN_NAV_LINKS.slice(1)"
            :key="link.href"
            :href="link.href"
            :label="link.label"
          />
        </div>
      </div>
    </div>
    <div class="py-3" />
    <div class="grid grid-cols-4 gap-y-2 xs:flex xs:max-w-screen xs:flex-row xs:flex-wrap xs:justify-evenly">
      <HeaderExternalLink
        v-for="link in SOCIAL_LINKS"
        :key="link.href"
        :href="link.href"
        :label="link.label"
      />
    </div>
  </nav>
</template>
