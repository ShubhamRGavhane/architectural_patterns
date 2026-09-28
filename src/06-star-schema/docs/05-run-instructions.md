# Run Instructions

To see the difference in computational complexity between Normalized and Denormalized schemas, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Normalized OLTP)
This script simulates the deep traversal required to answer a business question using a transactional database.

```bash
npx ts-node src/06-star-schema/problem/index.ts
```

**Expected Output:**
You will see the result calculated, but notice the 5 `JOIN` operations required in the code.

## 2. Run the Solution (Star Schema)
This script simulates the same question answered using a Data Warehouse star schema.

```bash
npx ts-node src/06-star-schema/solution/index.ts
```

**Expected Output:**
You will see the exact same result calculated, but requiring only 2 direct lookups.
