---
title: AgentX
description: A local desktop workspace for running coding agents with persistent threads, runtime controls, and approval-aware tool activity.
thumbnail: /projects/agentx-cover.webp
pubDate: 2026-02-25
draft: false
tags:
  - Electron
  - Vue
  - AI
---

AgentX is a desktop application that lets you orchestrate coding agents with persistent threads, runtime controls, and approval-aware tool activity.
It's an internal tool I built because I was tired of working in terminals.
I never thought TUIs were the best way to work with coding agents.
UIs have always been more efficient at managing complex workflows and state.
This project started with a simple frustration: I wanted a harness that would let me work with different AI providers, all in one place.
This was back when the Codex app was still rough around the edges, and Cursor Glass hadn't even been imagined yet.
The goal was not to replace a terminal or an editor.
I just wanted a central control panel for my agents: choose a workspace, start a thread, pick a model, set the runtime safety mode, watch the agent's activity, approve sensitive actions, and keep the history around after the turn finishes.

## The Problem

When I started looking at coding agent implementation details, I quickly realized that the providers clearly had not been designed to talk to each other.
Nothing was standardized.
Each provider had its own way of doing things.
Message structures were different, tool calls were different, approval processes were different, etc.

So the first major problem I faced was creating an abstraction layer that would let different providers be compatible with each other.
Because despite [OpenAI's Codex App Server](https://developers.openai.com/codex/app-server) and [Anthropic's Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview), there was still a lot of work to be done to make Claude and GPT models _"speak the same language"_.
Today, it has become trivial to do so thanks to things like [Pi Coding Agent](https://pi.dev), but at the time, it was still unknown territory.

I built the abstraction layer with Effect by treating each AI provider as a service with the same basic responsibilities.
Instead of letting the rest of the app talk directly to OpenAI, Anthropic, or any other runtime, I defined one shared `Provider` interface for things like listing models, authenticating, starting a turn, streaming events, interrupting work, and answering approval requests.
Each provider then became a small adapter that translated its own API into that common shape.
This made the app much easier to reason about: the UI only had to understand one set of concepts, while Effect handled the wiring, errors, dependencies, and streaming behavior in a consistent way.

At its core, a simplified version of the abstraction looked like this:

```ts
import { Context, Effect, Stream } from "effect";

export class Provider extends Context.Tag("Provider")<
  Provider,
  {
    readonly listModels: () => Effect.Effect<Model[], ProviderError>;
    readonly auth: () => Effect.Effect<Account, AuthError>;
    readonly startTurn: (
      input: TurnInput
    ) => Stream.Stream<AgentEvent, ProviderError>;
    readonly interrupt: (turnId: TurnId) => Effect.Effect<void, ProviderError>;
    readonly respondToApproval: (
      decision: ApprovalDecision
    ) => Effect.Effect<void, ProviderError>;
  }
>() {}
```

Everything else in the app was written against `Provider`, never against a specific vendor.

## What I built

AgentX is a local Electron app built with Vue, Vite, TypeScript, Tailwind, oRPC, Effect, TanStack Query, Drizzle, and SQLite.

The product centers around a few core concepts:

- Workspaces that point to local project folders.
- Threads grouped under each workspace.
- Agent sessions that connect a local thread to a provider thread.
- Turns that store the user message, streamed assistant text, reasoning, status, and errors.
- Tool activity items for command execution, file changes, MCP calls, web search, plans, and multi-agent work.
- Runtime controls for model, reasoning effort, sandbox mode, and approval policy.
- Approval cards for command, file-change, and input requests.

From a user's perspective, the workflow is straightforward: create or select a workspace, send a prompt, watch the agent work, approve anything that needs permission, and return to the same thread later without losing the local history.

## The Runtime Layer

The most interesting technical part of AgentX is the runtime manager.

AgentX keeps a local model of the agent lifecycle and adapts provider events into that model. A local thread can have one or more agent sessions. Each session records the provider, provider thread ID, model, reasoning effort, sandbox mode, approval policy, status, and any handoff source session. Turns and tool items are stored separately so the UI can reconstruct the conversation and activity timeline from SQLite.

When a user sends a turn, the runtime manager resolves the workspace, creates or reuses the local thread, chooses the provider for the selected model, creates or updates the session snapshot, records the new turn, checks authentication, and then starts or resumes the provider thread.

That flow gives AgentX a few useful properties:

- The UI can show local thread history even when the provider runtime is not currently active.
- A thread can switch models or provider sessions without losing the surrounding local context.
- Authentication can pause a turn, launch the sign-in flow, and resume pending work once the provider reports that the account is available.
- Approval requests can be routed back to the right provider request while still appearing as first-class UI cards.

## Architecture

AgentX has three main layers.

The Electron main process owns the native window, starts the oRPC server, registers IPC handlers, and keeps the runtime manager alive for the lifetime of the app.

The local server layer exposes workspace, thread, and agent operations to the renderer. SQLite is the durable store, with Drizzle schemas for workspaces, threads, agent sessions, turns, and tool items.

The renderer is a Vue app built around query hooks and composables. TanStack Query handles the read/write lifecycle for workspaces, threads, agent history, model lists, auth status, sending turns, interrupting turns, and approval responses.

I liked this architecture because it keeps the agent runtime explicit. The provider can stream whatever low-level events it needs to stream, but the rest of the app deals with local concepts: workspace, thread, session, turn, item, approval, and status.

## What This Project Demonstrates

AgentX was useful because it forced me to think about agent UX as a systems problem, not just a chat problem.
It includes desktop application development, local persistence, typed RPC, provider abstraction, streaming event handling, authentication handoff, approval workflows, thread resumption, runtime safety controls, and a UI for making all of this understandable.
It also reflects the kind of agent tooling I want to use myself: local-first, workspace-aware, inspectable, and direct about what the runtime is allowed to do.
It's one of the reasons why I now use the Codex app and Cursor Glass in my day-to-day workflow.
I believe these tools are among the best ways to orchestrate coding agents.
