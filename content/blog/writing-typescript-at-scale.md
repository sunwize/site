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
It's always been a challenge to ship code into a huge codebase with confidence, especially when you're working on a large team.
That's partly why we have developed processes and tools to help us test and validate our code during QA and review before it's deployed.
But with the rise of AI agents and how fast they can generate code, the need for stronger safeguards at the coding level is becoming increasingly important.
We need to find ways to strengthen the feedback loops directly within the development process so we can catch errors and regressions early on.

This is where [**Effect**](https://effect.website) comes in.
Effect is a library (some may even say a language) that helps you write TypeScript code that is both type-safe and composable.
It's a way to write code that is easy to understand, easy to test, and easy to maintain.

This might all sound very abstract, so let's look at a few examples to illustrate the problems and how Effect solves them.

## Error typing

In normal TypeScript, this function tells you nothing about how it can fail:

```ts
async function placeOrder(): Promise<Order> {
  const taxes = await computeTaxes(cart);
  const payment = await processPayment({
    customerId,
    amount: cart.subtotal + taxes.total,
  });

  return await createOrder({ cart, taxes, payment });
}
```

The `placeOrder` function doesn't inherit from the error types its child functions can throw.
This means you have to manually go down the call stack and handle each error type in the parent function, which is error-prone and verbose.

```ts
async function placeOrder(): Promise<Order> {
  try {
    const taxes = await computeTaxes(cart);
    const payment = await processPayment({
      customerId,
      amount: cart.subtotal + taxes.total,
    });

    return await createOrder({ cart, taxes, payment });
  } catch (error) {
    if (error instanceof TaxComputationError) {
      handleGracefully(error);
    } else if (error instanceof PaymentProcessingError) {
      handleGracefully(error);
    } else if (error instanceof OrderCreationError) {
      handleGracefully(error);
    } else {
      throw error; // What's left to handle? Who knows?
    }
  }
}
```

In Effect, you can define the error types for your functions and let them compose nicely.

```ts
const computeTaxes: Effect.Effect<Taxes, TaxComputationError> = ...;

const processPayment: Effect.Effect<Payment, PaymentProcessingError> = ...;

const createOrder: Effect.Effect<Order, OrderCreationError> = ...;

const placeOrder: Effect.Effect<
  Order,
  TaxComputationError | PaymentProcessingError | OrderCreationError
> = Effect.gen(function* () {
  const taxes = yield* computeTaxes(cart);
  const payment = yield* processPayment({
    customerId,
    amount: cart.subtotal + taxes.total,
  });

  return yield* createOrder({ cart, taxes, payment });
});
```

All the errors are tracked at the type level, which means at any point in your program, you can know exactly what errors can happen.
This gives you type-safety and composability without the need for manual error handling.
In fact, you can wait up until the edge of the program to handle errors.
If you're building an API for instance, it would be in your endpoint handler.

```ts
async function endpointHandler(request: Request): Promise<Response> {
  const program: Effect.Effect<
    Order,
    never // The errors are automatically removed from the type as you handle them
  > = placeOrder.pipe(
    Effect.catchTags({
      // Theses tags are type-safe
      TaxComputationError: (error) =>
        Effect.succeed(new Response("Tax computation failed", { status: 400 })),
      PaymentProcessingError: (error) =>
        Effect.succeed(new Response("Payment failed", { status: 402 })),
      OrderCreationError: (error) =>
        Effect.succeed(new Response("Order creation failed", { status: 500 })),
    })
  );

  const result = await Effect.runPromise(program);
}
```

The fact that everything becomes an effect gives you that composability you need to build complex programs.
Let's say I want to:

- Use OpenTelemetry to trace the call
- Retry the operation 3 times with 100ms delay between retries
- Timeout the operation if it takes too long

In Effect, I can just do:

```ts
placeOrder.pipe(
  Effect.withSpan("place-order", { attributes: { customerId } }),
  Effect.retry(Schedule.exponential("100 millis").pipe(Schedule.recurs(3))),
  Effect.timeout("5 seconds")
);
```

The result is a program that is traced, retried, and timed out.
It took only 3 lines of code, while being very descriptive and easy to understand.

## Dependency injection

Another thing that gets hard at scale is dependency injection.
In normal TypeScript, dependencies tend to be hidden in imports, globals, or constructor arguments that have to be passed around manually.
This makes code harder to test and harder to compose.

```ts
class OrdersService {
  constructor(
    private readonly taxes: TaxService,
    private readonly payments: PaymentService,
    private readonly orders: OrdersRepository
  ) {}

  async placeOrder(): Promise<Order> {
    const taxes = await this.taxes.computeTaxes(cart);
    const payment = await this.payments.processPayment({
      customerId,
      amount: cart.subtotal + taxes.total,
    });

    return await this.orders.createOrder({ cart, taxes, payment });
  }
}
```

This works, but TypeScript cannot see how the service is wired together.
The constructor says what `OrdersService` needs, but the surrounding dependency setup lives somewhere else.
As the app grows, you have to inspect framework configuration, container bindings, or tests to understand what actually has to exist at runtime.
With Effect, dependencies are tracked in the third type parameter.

```ts
const placeOrder: Effect.Effect<
  Order,
  TaxComputationError | PaymentProcessingError | OrderCreationError,
  TaxService | PaymentService | OrdersRepository
> = Effect.gen(function* () {
  const taxService = yield* TaxService;
  const paymentService = yield* PaymentService;
  const ordersRepository = yield* OrdersRepository;

  const taxes = yield* taxService.computeTaxes(cart);
  const payment = yield* paymentService.processPayment({
    customerId,
    amount: cart.subtotal + taxes.total,
  });

  return yield* ordersRepository.createOrder({ cart, taxes, payment });
});
```

The type tells you that this program can fail with three error types and requires three services to run.
Nothing is hidden.
When you provide those services, the dependency requirement disappears from the type.

```ts
const runnable: Effect.Effect<
  Order,
  TaxComputationError | PaymentProcessingError | OrderCreationError,
  never // No more dependencies to provide
> = placeOrder.pipe(
  Effect.provide(TaxServiceLive),
  Effect.provide(PaymentServiceLive),
  Effect.provide(OrdersRepositoryLive)
);
```

This makes tests much simpler too.
You can provide a test implementation without changing the program itself.

```ts
const testProgram = placeOrder.pipe(
  Effect.provide(TaxServiceTest),
  Effect.provide(PaymentServiceTest),
  Effect.provide(OrdersRepositoryTest)
);
```

Dependency injection becomes another part of the type system.
You know what the program needs, what it can fail with, and what it produces, all from the type.

## Effect in the world of AI Agents

Effect has been around for a while now, but it used to be very costly to adopt.
The weird and verbose syntax, the mental model, and the lacking of learning materials made it very hard to jump in.
But now, with the extensive usage of AI agents in programming, it's become trivial to develop effectful solutions.
Given the right tools and harnesses, most models are now capable of generating good Effect code.
I'd recommend looking at the official [Effect Solutions](https://effect.solutions) to learn how to setup your agentic environment so it's optimized for Effect.
