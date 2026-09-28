# Run Instructions

To see the massive computational difference between deduplication and concatenation, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Implicit DISTINCT via UNION)
This script simulates merging two non-overlapping arrays of 100,000 objects. It simulates the database performing a deep uniqueness check on every single row before returning the result.

```bash
npx ts-node src/10-sql-unions/problem/index.ts
```

**Expected Output:**
You will notice a delay (hundreds of milliseconds) as the JS engine hashes and validates 200,000 objects in a Set.

## 2. Run the Solution (Instant UNION ALL)
This script simulates merging the exact same data using a pure concatenation approach.

```bash
npx ts-node src/10-sql-unions/solution/index.ts
```

**Expected Output:**
The operation should take close to 0-5ms, proving that when datasets are mutually exclusive, bypassing the deduplication phase is a critical optimization.
