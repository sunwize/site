---
title: Writing TypeScript at scale
description: How to write TypeScript at scale.
pubDate: 2026-06-06
tags:
  - typescript
  - engineering
draft: false
---

It would be an understatement to say that writing TypeScript at scale is hard.
It's always been a challenge to ship code into a huge codebase with confidence.
This is where [**Effect**](https://effect.website) comes in.
To illustrate the problems and how Effect solves them, let's look at a few examples.

## Promises

Plain TypeScript gives you `Promise`, but it is limited in many ways:

- It has no typed error channel.
- It starts running immediately.
- It does not model dependencies.
- It does not model cancellation very explicitly.
- It does not give you structured concurrency by default.

Effect gives you lazy, composable descriptions of what the program does.

```ts
const program = Effect.gen(function* () {
  const user = yield* getUser(userId);
  const orders = yield* getOrders(user.id);
  yield* sendEmail(user.email, orders);

  return orders;
});
```

## Error typing

In normal TypeScript, this function tells you nothing about how it can fail:

```ts
async function sendOrdersEmail(): Promise<void> {
  const user = await getUser(userId);
  const orders = await getOrders(user.id);
  await sendEmail(user.email, orders);
}
```

The `program` function doesn't inherit from the error types of its child functions.
This means you have to manually go down the call stack and handle each error type in the parent function, which is error-prone and verbose.

```ts
async function sendOrdersEmail(): Promise<void> {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    await sendEmail(user.email, orders);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      handleGracefully(error);
    } else if (error instanceof OrdersNotFoundError) {
      handleGracefully(error);
    } else if (error instanceof EmailSendingError) {
      handleGracefully(error);
    } else {
      throw error; // What's left to handle? Who knows?
    }
  }
}
```

In Effect, you can define the error types for your functions and let them compose nicely.

```ts
const getUser: Effect.Effect<User, UserNotFoundError> = ...;

const getOrders: Effect.Effect<Order[], OrdersNotFoundError> = ...;

const sendEmail: Effect.Effect<void, EmailSendingError> = ...;

const sendOrdersEmail: Effect.Effect<
  Order[],
  UserNotFoundError | OrdersNotFoundError | EmailSendingError
> = Effect.gen(function* () {
  const user = yield* getUser(userId);
  const orders = yield* getOrders(user.id);
  yield* sendEmail(user.email, orders);

  return orders;
});
```

All the errors are tracked at the type level, which means at any point in your program, you can know exactly what errors can happen.
This gives you type-safety and composability without the need for manual error handling.
In fact, you can wait up until the edge of the program to handle errors.
If you're building an API for instance, it would be in your endpoint handler.

```ts
async function endpointHandler(request: Request): Promise<Response> {
  const result = await Effect.runPromise(
    sendOrdersEmail.pipe(
      Effect.catchTags({
        // Theses tags are type-safe
        UserNotFoundError: (error) =>
          Effect.succeed(new Response("User not found", { status: 404 })),
        OrdersNotFoundError: (error) =>
          Effect.succeed(new Response("Orders not found", { status: 404 })),
        EmailSendingError: (error) =>
          Effect.succeed(new Response("Email sending failed", { status: 500 })),
      })
    )
  );
}
```

The fact that everything becomes an effect gives you that composability you need to build complex programs.
Let's say I want to:

- Use OpenTelemetry to trace the call
- Retry the operation 3 times with 100ms delay between retries
- Timeout the operation if it takes too long

In Effect, I can just do:

```ts
sendOrdersEmail.pipe(
  Effect.withSpan("send-orders-email", { attributes: { userId } }),
  Effect.retry(Schedule.exponential("100 millis").pipe(Schedule.recurs(3))),
  Effect.timeout("5 seconds")
);
```

The result is a program that is traced, retried, and timed out.
It took only 3 lines of code, while being very descriptive and easy to understand.

## Effect in the world of AI Agents

Effect has been around for a while now, but it used to be very costly to adopt.
The weird and verbose syntax, the mental model, and the lacking of learning materials made it very hard to jump in.
But now, with the extensive usage of AI agents in programming, it's become trivial to develop effectful solutions.
Given the right tools and harnesses, most models are now capable of generating good Effect code.
I'd recommend looking at the official [Effect Solutions](https://effect.solutions) to learn how to setup your agentic environment so it's optimized for Effect.
