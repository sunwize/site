---
title: My AI workflow
description: How I use AI to build software.
intro: "Note to myself: This is supposed to be a living document. I should update it regularly."
pubDate: 2026-06-05
tags:
  - ai
draft: false
---

AI is such a powerful tool that it's easy to feel like you're not getting the most out of it.
LLMs are an incredible source of raw intelligence, but without the right workflows and harnesses, they're just a waste of potential.
Think of a car. You may have the best engine out there, but without the right chassis, wheels, and tires, you're not going anywhere.

In my journey using AI, I've used many tools and experienced many workflows.
I've learned a lot from each of them and made a lot of rookie mistakes.
I think now is the time to share my findings.

## Start with planning

The main reason why people often complain about AI _"making mistakes"_ is almost always because they didn't come to a shared understanding with the agent before starting the work.
If you can't clearly articulate your vision, you can't expect to delegate the task and get the desired outcome, whether you work with humans or AI agents.
That's why the first step is always some sort of planning.

Personally, I don't like using the built-in planning mode harnesses tend to offer.
I much prefer starting a conversation with the agent to discuss a new feature or a change until I feel confident we have enough context to start working on the task.
It feels much more natural than generating a giant `PLAN.md` file that no one actually understands.
Instead, the conversation history serves as the underlying context for the agent to understand the task and the desired outcome.
This has been a game-changer in my workflow and it has also dramatically reduced the friction of starting a new task.

## Implement vertically

Once you and your agent have a shared understanding of the task, the next step is usually the code.
I prefer implementing features vertically, which means I'll usually reduce the scope to prioritize an end-to-end working solution.
In practice, that means a single feature can include database, API, and UI changes all in one pass.
The idea behind this way of working is twofold: I get my hands on something I can QA very early on, and it significantly reduces the overhead of the reviewing process, because the changes are all scoped to a single feature.
This enables me to iterate much more efficiently and get to the desired solution much faster.

## Test

One the desired solution is in place, I like to manually test it thoroughly to make sure it works as expected.
Once I'm happy with the result, I usually ask the agent to add some test coverage for the feature.
This adds an additional layer of safety and provides some feedback loops for the future agents.

## Code review

The last step before shipping the code is to review it to catch the last discrepancies.
You have plenty of options for this, from CodeRabbit and Greptile for cloud solutions, to local reviews with Claude Code or Codex code review.
I personnally like the `/thermo-nuclear-code-quality-review` skill from Cursor, because it fixes the main issue I have with most code review tools: they often lack ambition.
Usually the agent treats the Git diffs as the boundary of what it can work on.
This prompt goes a step further: it starts from the current branch's changes, then looks across the entire codebase for related opportunities.
There are a lot more cool things about this skill, but I'll let you discover it for yourself.

## Tools I use

### Skills

- [`/thermo-nuclear-code-quality-review`](https://www.skills.sh/cursor/plugins/thermo-nuclear-code-quality-review) from Cursor
- [`/frontend-design`](https://www.skills.sh/anthropics/skills/frontend-design) from Anthropic
- `/local-commit` to generate commit messages
- `/pr-description` to write pull request descriptions

### Agents

- Cursor (mainly Cursor Glass)
- Codex App

### Models

- `GPT-5.5 Low/Medium` for everyday tasks
- `Composer 2.5 Fast` because it's underrated
- `Opus 4.8 Thinking High` for UI stuff
