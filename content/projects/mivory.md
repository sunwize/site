---
title: Mivory
description: A cross-platform personal link library for saving, organizing, and rediscovering web content.
thumbnail: /projects/mivory-cover.png
pubDate: 2026-06-03
draft: false
projectUrl: https://mivory.app
---

Mivory is a personal link library I built to solve a problem that sounds small until it becomes daily friction: we save useful links everywhere, then lose them across browser tabs, social feeds, chat messages, notes, and app-specific bookmarks.

The goal was not to build another place to dump URLs. I wanted Mivory to feel like an inbox for the internet: fast enough to capture a link from wherever I found it, structured enough to organize later, and smart enough to help me rediscover something even when I did not remember the exact title.

Mivory is available on the [App Store](https://apps.apple.com/app/id6741949955) and the [Google Play Store](https://play.google.com/store/apps/details?id=com.mivory.app).

## The Problem

Most bookmarking workflows break at the moment they should be easiest.

If I find something useful on my phone, I do not want to open a separate app, copy the URL, paste it into a form, choose a folder, and clean up the title. If I find something in the browser, I do not want it buried in a browser-specific bookmark tree that I never search. If I save links for a project, I want other people to be able to access that collection without turning it into a document maintenance chore.

Mivory started from that observation: the capture step has to be nearly invisible, and the retrieval step has to be better than scrolling through a long list.

## What I Built

Mivory is a full-stack application with a web app, a browser extension, and mobile support through Capacitor.

The product centers around a few simple concepts:

- An inbox for links that have not been organized yet.
- Collections for grouping links by topic, project, or use case.
- A share-sheet workflow for saving links from mobile apps.
- A browser extension for saving links from the desktop web.
- Collaborative collections with invitations, roles, and members.
- Search that combines exact text matching with semantic retrieval.

From a user's perspective, the main workflow is straightforward: find a link, share it to Mivory, let the app extract the useful metadata, then move it into the right collection when needed.

## Product Details

The mobile experience was an important part of the project. A lot of links worth saving do not come from traditional websites anymore. They come from apps like Instagram, TikTok, YouTube, Reddit, or whatever else happens to be open at the time.

That pushed the app toward native-feeling details: share target support, safe areas, pull-to-refresh, haptics, keyboard handling, onboarding for the iOS share sheet, and small interactions that make the app feel less like a web page wrapped in a mobile shell.

The browser extension fills the same role on desktop. It gives Mivory a low-friction capture path from the web without forcing the user to switch context.

## The Search Layer

The most interesting technical part of Mivory is the **search engine**, because the toughest part of bookmarking apps has always been the retrieval part.

That's why from the very beginning, I've been building the app with this goal in mind: _"How good can a search engine get?"_

Mivory indexes bookmarks with two complementary approaches:

- PostgreSQL full-text search for precise keyword matching.
- Vector search for semantic similarity, so results can match the meaning of a query even when the exact words differ.

When a bookmark is created, the app extracts metadata from the page, stores the title, description, site name, domain, image, and every other context it can find, then indexes the bookmark for search. The database uses full-text indexes and vector indexes so search remains fast as collections grow.

I also added AI-generated keywords and language detection to make the full-text index more useful.
The point is not to make the app feel like an AI product.
The point is to make it seemless to retrieve saved links later.

## Architecture

The project is organized as a monorepo with shared packages for the web app, browser extension, API, and common types.

The stack includes Nuxt, TypeScript, oRPC, TanStack Query, Drizzle, PostgreSQL, Better Auth, WXT for the browser extension, and Capacitor for mobile builds.
The API handles authentication, bookmark creation, metadata extraction, collection permissions, collaboration, search, rate limiting, and safety checks.

I liked this architecture because it lets all the different clients share the same domain model and API contracts.
The web app, mobile app, and extension are different entry points into the same underlying system.
It has made the development process of this many sub-projects much easier for a solo dev like me.

## What This Project Demonstrates

Mivory was a useful project because it forced me to work across the entire product stack.

It includes user-facing product decisions, mobile interaction details, browser-extension development, authentication, database modeling, role-based permissions, API design, search infrastructure, metadata extraction, analytics, and deployment concerns.

It also reflects the kind of engineering work I enjoy most: taking a common everyday frustration, reducing it to a simple product model, then building the infrastructure needed to make that model feel effortless.

## Next Steps

The next improvements I would focus on are better collection-level discovery, richer previews for different kinds of media, and more ways to turn saved links into something useful.

My vision would stay the same: Mivory should be a quiet, reliable place to save the internet you actually want to remember.
