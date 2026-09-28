# Run Instructions

To see the massive difference in computational overhead between row-by-row deletions and partition dropping, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Monolithic Table Deletion)
This script simulates a 600,000 row table. It attempts to delete 50,000 rows by scanning and splicing the array manually, simulating database row locks and transaction log overhead.

```bash
npx ts-node src/13-physical-schema/problem/index.ts
```

**Expected Output:**
You will notice a measurable delay (milliseconds to seconds depending on your CPU) as the engine struggles to rewrite the array in memory.

## 2. Run the Solution (Partition Dropping)
This script simulates 600,000 rows split across 12 partitions. It deletes 50,000 rows by simply dropping the reference to the partition.

```bash
npx ts-node src/13-physical-schema/solution/index.ts
```

**Expected Output:**
The deletion will happen in 0 or 1 milliseconds. It is completely independent of the size of the data being deleted.
