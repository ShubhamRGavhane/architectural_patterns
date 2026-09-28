# Run Instructions

To see how child-table inserts can violate business rules and how Aggregate Roots prevent it, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Phantom Inserts)
This script simulates two concurrent requests adding items to an order without locking the parent order.

```bash
npx ts-node src/16-aggregates-locks/problem/index.ts
```

**Expected Output:**
You will see both requests successfully add $600 items to the order, resulting in a $1200 total, blatantly violating the $1000 maximum limit.

## 2. Run the Solution (Aggregate Versioning)
This script simulates the same requests, but requires them to atomically increment the parent order's version before inserting child items.

```bash
npx ts-node src/16-aggregates-locks/solution/index.ts
```

**Expected Output:**
You will see Request A succeed and bump the order version. Request B will fail its version check and gracefully abort, protecting the $1000 limit.
