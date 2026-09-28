# The Problem: Partial Commits

## The Anti-Pattern
Attempting to modify data in two separate databases sequentially without a coordinator.
```typescript
await postgresDB.execute("UPDATE accounts SET balance = balance - 100");
await mysqlDB.execute("UPDATE accounts SET balance = balance + 100");
```

## Why it Fails
Because there is no coordinator, the first statement commits instantly. If the network connection to `mysqlDB` drops before the second statement executes, the $100 is permanently lost.
Unlike a Saga, which would theoretically have a background job trying to put the $100 back into `postgresDB`, a system lacking both Saga and 2PC is left permanently corrupted.

## Code Demonstration
In `problem/index.ts`, we simulate this exact banking scenario. Bank A successfully deducts $100. Then Bank B crashes. The application throws an error, but the $100 is gone from Bank A and nowhere to be found in Bank B.
