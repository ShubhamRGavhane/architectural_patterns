# Run Instructions

To see the consequences of race conditions and how atomic claims prevent them, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Race Condition)
This script simulates two concurrent users trying to book the same item using standard read-then-write logic.

```bash
npx ts-node src/14-claims/problem/index.ts
```

**Expected Output:**
You will see that both Alice and Bob receive a SUCCESS message, but the final database state shows that Bob overwrote Alice's purchase.

## 2. Run the Solution (Atomic Claim)
This script simulates the same two concurrent users, but uses a Check-And-Set atomic update.

```bash
npx ts-node src/14-claims/solution/index.ts
```

**Expected Output:**
You will see that Alice succeeds, but Bob receives a FAILED message because the database prevented his update from altering 0 rows.
