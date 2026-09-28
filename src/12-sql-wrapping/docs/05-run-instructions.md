# Run Instructions

To observe the catastrophic failure of Non-SARGable O(N) scans vs SARGable O(log N) index seeks, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Non-SARGable Full Table Scan)
This script simulates an engine evaluating a function (`.getFullYear()`) against 1 million rows.

```bash
npx ts-node src/12-sql-wrapping/problem/index.ts
```

**Expected Output:**
You will notice a measurable delay as the Javascript runtime executes the function on 1,000,000 items.

## 2. Run the Solution (SARGable Index Seek)
This script simulates the engine jumping directly to the data via Binary Search, reading the range, and immediately stopping.

```bash
npx ts-node src/12-sql-wrapping/solution/index.ts
```

**Expected Output:**
The script will complete nearly instantaneously, demonstrating that proper SARGable syntax unlocks the power of the B-Tree index.
