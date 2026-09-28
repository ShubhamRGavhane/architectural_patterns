# Run Instructions

To observe the catastrophic failure of O(N) scans vs O(1) index seeks, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Full Table Scan)
This script simulates an engine evaluating an `OR` condition against 1 million rows.

```bash
npx ts-node src/11-sql-or-performance/problem/index.ts
```

**Expected Output:**
You will notice a measurable delay as the Javascript runtime iterates over 1,000,000 items.

## 2. Run the Solution (UNION ALL Index Seeks)
This script simulates the engine jumping directly to the data via indexed maps.

```bash
npx ts-node src/11-sql-or-performance/solution/index.ts
```

**Expected Output:**
The script will complete instantaneously (0-1ms), demonstrating the power of index utilization.
