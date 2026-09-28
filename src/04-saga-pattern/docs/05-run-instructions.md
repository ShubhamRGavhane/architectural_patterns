# Run Instructions

To see how distributed transactions fail and how a Saga safely rolls them back, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Data Inconsistency)
This script simulates booking a multi-step trip where the final step fails.

```bash
npx ts-node src/04-saga-pattern/problem/index.ts
```

**Expected Output:**
You will see the Flight and Hotel book successfully, but when the Car fails, the script ends. The user has lost their money on the Flight and Hotel with no refund.

## 2. Run the Solution (Saga Pattern)
This script wraps the exact same scenario in a Saga Orchestrator.

```bash
npx ts-node src/04-saga-pattern/solution/index.ts
```

**Expected Output:**
You will see the Flight and Hotel book successfully. When the Car fails, the Orchestrator catches the error, looks at its internal log, and actively calls the cancellation/refund methods for the Hotel and the Flight, leaving the system perfectly consistent.
