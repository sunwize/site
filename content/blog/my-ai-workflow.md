---
title: My AI workflow
description: How I use AI to build software.
intro: "Note to myself: This is supposed to be a living document. I should update it regularly."
pubDate: 2026-03-05
updatedDate: 2026-10-23
tags:
  - ai
draft: false
---

AI is such a powerful tool that it's easy to feel like you're not getting the most out of it.
LLMs are an incredible source of raw intelligence, but without the right workflows and harnesses, they're just a waste of potential.
It's like having the best car engine out there, without the right chassis, wheels, and tires, you're not going anywhere.

In my journey using AI, I've used many tools and experienced many workflows.
I've learned a lot from each of them and made a lot of rookie mistakes.
I think now is the time to share my findings.

## One harness

I used to bounce between Cursor Glass, the Codex app, and Claude Code as separate products.
I now run all of them from one place: [T3 Code](https://t3.codes).
It's a centralized harness that can drive Codex, Cursor, and Claude Code from a single interface.

What I like most is the inbox-style sidebar.
Active threads sit at the top as cards, so I can see everything that's still in flight.
When a thread is done, I settle it and it drops into a collapsed Settled section.
Threads can also auto-settle after inactivity, or when a linked PR merges.
That makes it easy to keep many agents running in parallel without losing track of the ongoing work.

## Start with planning

The main reason why people often complain about AI _"making mistakes"_ is almost always because they didn't come to a shared understanding with the agent before starting the work.
If you can't clearly articulate your vision, you can't expect to delegate the task and get the desired outcome, whether you work with humans or AI agents.
That's why the first step is always some sort of planning.

Personally, I don't like using the built-in planning mode harnesses tend to offer.
I much prefer starting a conversation with the agent to discuss a new feature or a change until I feel confident we have enough context to start working on the task.
It feels much more natural than generating a giant `PLAN.md` file that no one actually understands.
Instead, the conversation history serves as the underlying context for the agent to understand the task and the desired outcome.
Implementing this in my worflow has dramatically reduced the overhead of starting a new task.
I don't have to know everything about the task upfront, I can start with a vague idea and let the agent guide me through the process.
It helps me refine my vision and plan things out at the same time.

## Implement vertically

Once you and your agent have a shared understanding of the task, the next step is usually the code.
I prefer implementing features vertically, which means I'll usually reduce the scope to prioritize an end-to-end working solution.
In practice, that means a single feature can include database, API, and UI changes all in one pass.
The idea behind this way of working is twofold: I get my hands on something I can QA very early on, and it significantly reduces the overhead of the reviewing process, because the changes are all scoped to a single feature.
This enables me to iterate much more efficiently and get to the desired solution much faster.

## Complex tasks

For bigger or trickier tasks, I reach for [pstack](https://github.com/backnotprop/pstack) by Lauren Tan.
It's an open-source collection of agent skills built around a router skill, `/poteto-mode`, which picks the right workflow for the task at hand.
On top of that, it ships skills like `/architect` to explore several designs in parallel before writing code, `/arena` to have multiple models attempt the same task and keep the best result, and `/interrogate` for adversarial multi-model reviews.
It also lets me assign a model to each role, so the heavy thinking and the grunt work don't have to run on the same model.
That's where it pairs especially well with T3 Code's orchestration capabilities: T3 Code can spin up subagents from a different provider than the main agent.
For instance, I can have the main thread running on Claude while it delegates work to GPT subagents.
It's overkill for everyday changes, but it shines when the stakes are high.

## Test

Once the feature is in place, I like to manually test it thoroughly to make sure it works as expected.
Once I'm happy with the result, I usually ask the agent to add some test coverage for the changes.
This adds an additional layer of safety and provides some feedback loops for future agents.
Skipping this step might result in regressions that are hard to catch later on.

## Code review

The last step before shipping the code is to review it to catch the last discrepancies.
You have plenty of options for this, from _CodeRabbit_ and _Greptile_ in terms of cloud solutions, to local reviews with _Claude Code_ or _Codex code review_.
I personally use a custom-made code review skill, tailored to my stack and the things I care about: regressions, maintainability, and scope creep.
When there are a lot of changes, I also use T3 Code's guided review feature, which walks me through the diff so I don't get lost in it.

This is how I'm able to ship code with confidence: gradually building on top of the existing codebase while staying knowledgeable about how the system works.

<p class="text-center italic font-bold text-black">"Happy shipping! ✌️"</p>

## Tools I use

### Skills

- [pstack](https://github.com/backnotprop/pstack) by Lauren Tan for complex tasks
- A custom-made code review skill
- [`/frontend-design`](https://www.skills.sh/anthropics/skills/frontend-design) from Anthropic
- `/local-commit` to generate commit messages
- `/pr-description` to write pull request descriptions

### Agents

- [T3 Code](https://t3.codes) as the central harness for Codex, Cursor, and Claude Code

### Models

- `GPT-5.5 Low/Medium` for everyday tasks
- `Composer 2.5 Fast` because it's underrated
- `Opus 4.8 High` for UI stuff
