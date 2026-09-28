# The Problem: The Dual Write

## The Anti-Pattern
The naive approach is simply to run both commands one after the other:
```typescript
await database.save(order);
await kafka.publish("OrderCreated", order);
```

## Why it Fails
This is called a **Non-Atomic Dual Write**. The two systems are independent.
If the database successfully saves the order, but the network connection to Kafka times out right after, the application throws an exception.

Because the database transaction has already committed, the order exists in the database. But because the Kafka publish failed, no downstream services (like shipping or billing) will ever know the order exists. The system is in a permanently inconsistent state, and the user's order will never be fulfilled.

## Code Demonstration
In `problem/index.ts`, we simulate this exact scenario. The `saveToDatabase` function succeeds, but the `publishToMessageBroker` throws a network timeout error. The order is left in the DB, but the event is permanently lost.
