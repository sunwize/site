import { defineCollection, defineContentConfig } from "@nuxt/content";
import { z } from "zod";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const toIsoDateString = (date: unknown) => {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }

  if (typeof date === "string" && !isoDatePattern.test(date)) {
    return new Date(date).toISOString().slice(0, 10);
  }

  return date;
};

const contentDate = z.preprocess(toIsoDateString, z.string().regex(isoDatePattern));

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        pubDate: contentDate,
        updatedDate: contentDate.optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
      }),
    }),
    projects: defineCollection({
      type: "page",
      source: "projects/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        thumbnail: z.string(),
        pubDate: contentDate,
        updatedDate: contentDate.optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        projectUrl: z.string().url().optional(),
        repoUrl: z.string().url().optional(),
      }),
    }),
  },
});
