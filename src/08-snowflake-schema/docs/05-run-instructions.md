# Run Instructions

To see the difference in update speeds and storage bloat, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Star Schema Bloat)
This script simulates having to iterate over and update every single row in a dimension table just to rename a region.

```bash
npx ts-node src/08-snowflake-schema/problem/index.ts
```

**Expected Output:**
You will see that the application has to loop through the entire array and update multiple rows to apply a single conceptual change.

## 2. Run the Solution (Snowflake Schema)
This script simulates the same update in a normalized dimension structure.

```bash
npx ts-node src/08-snowflake-schema/solution/index.ts
```

**Expected Output:**
You will see the update completes by modifying exactly 1 row, proving the efficiency of updates at the cost of requiring more JOINs for read queries.
