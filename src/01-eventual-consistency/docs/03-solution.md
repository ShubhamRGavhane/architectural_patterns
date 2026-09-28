# The Solution: Asynchronous Event-Driven Architecture

## How the Pattern Fixes the Problem
Instead of calling the `Billing Service` synchronously, the `User Service` adopts the **Eventual Consistency** pattern via an asynchronous event bus (message broker).

1. The `User Service` saves the user to the database.
2. It publishes a `UserCreated` event to the message broker.
3. It immediately returns a "200 OK" to the user.
4. The `Billing Service` consumes the event from the broker at its own pace.

## Trade-offs
- **Complexity:** You now have to manage a message broker (like Kafka, RabbitMQ, or AWS SQS).
- **Out of Sync Data:** There is a brief window (milliseconds to minutes) where the User exists, but their Billing profile does not. The UI must be designed to handle this "pending" state.
- **Error Handling (Dead Letter Queues):** If the Billing service fails to process the event after 3 retries, you need a mechanism (like a Dead Letter Queue) to store the failed event for manual intervention, because you can no longer simply return an HTTP 500 to the user.

## Code Demonstration
In `solution/index.ts`, we simulate this using Node's `EventEmitter` as a mock message broker. 
Even though the Billing Service takes several seconds and multiple retries to process the charge, the `userSignupEventual()` function completes instantly. The system is highly available and eventually consistent.
