# Run Instructions

To see the difference between a dangerous dual-write and a safe transactional outbox, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Data Loss)
This script simulates writing to the database successfully, but then failing to reach the message broker.

```bash
npx ts-node src/03-outbox-pattern/problem/index.ts
```

**Expected Output:**
You will see the database save complete, but then an error is thrown, leaving the data permanently out of sync.

## 2. Run the Solution (Outbox Pattern)
This script saves the data and the event to a mock database array atomically. Then a background relay tries to publish it.

```bash
npx ts-node src/03-outbox-pattern/solution/index.ts
```

**Expected Output:**
You will see the transaction commit immediately. Then, the relay worker attempts to publish. Since we simulated a random network failure, you might see the relay fail and retry, but the data is safely preserved in the outbox until it succeeds.
