---
title: Personal Site
description: Nuxt 4 rebuild with a compact mono visual system.
thumbnail: https://placehold.co/1200x675/png?text=Personal+Site
pubDate: 2026-06-02
tags:
  - nuxt
  - tailwind
  - content
draft: false
repoUrl: https://github.com/sunwize/site
---

This website is my personal publishing space for writing, project notes, and experiments. The current version is a Nuxt 4 static site built around a compact monochrome visual system.

## Goals

- Keep writing and projects in plain markdown.
- Make the site easy to statically generate and deploy.
- Use a small set of reusable card, tag, layout, and typography primitives.
- Preserve room for playful interaction without making the site feel heavy.

## Stack

The site uses Nuxt 4, Nuxt Content, Vue, Tailwind CSS, and TypeScript. Blog posts and project pages are stored as separate Nuxt Content collections so they can share the same authoring workflow while staying distinct in navigation, queries, and page templates.

## What I Built

The first pass focused on the publishing shell: navigation, responsive headers, post cards, project cards, markdown rendering, syntax highlighting, tags, and a minimal visual language based on bold borders, mono typography, and patterned surfaces.

The project section now works like the blog section: each project is a markdown file with frontmatter for title, description, thumbnail, date, tags, and optional links.

## Next Steps

I want this site to become a durable home for small tools, experiments, and build notes. The next useful improvements are richer project metadata, better project screenshots, and more detailed writeups for the things I ship.
