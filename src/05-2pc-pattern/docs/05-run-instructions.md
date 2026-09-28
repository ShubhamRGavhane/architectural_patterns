# Run Instructions

To see how lack of coordination leads to lost data, and how a coordinator prevents it, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Data Loss)
This script simulates writing to Bank A successfully, but failing to write to Bank B.

```bash
npx ts-node src/05-2pc-pattern/problem/index.ts
```

**Expected Output:**
You will see Bank A deduct the money, followed by a crash, leaving the money unaccounted for.

## 2. Run the Solution (2PC Pattern)
This script uses a coordinator to execute Phase 1 and Phase 2.

```bash
npx ts-node src/05-2pc-pattern/solution/index.ts
```

**Expected Output:**
You will see the Coordinator ask both databases to PREPARE. Because Bank B fails the prepare phase, the Coordinator issues a global ABORT. You will see Bank A unlock its funds safely, preventing any data loss.
