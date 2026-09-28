# Run Instructions

To observe how partial execution corrupts systems and how Checkpoints fix it, run these scripts.

## Prerequisites
Ensure you are in the root of the `patterns-poc` project.

## 1. Run the Problem (Double Execution)
This script simulates a worker crashing midway through a multi-step job, and a second worker picking up the expired lease.

```bash
npx ts-node src/19-lease-dirtiness/problem/index.ts
```

**Expected Output:**
You will see that the system registers 2 credit card charges and 1 item shipped, demonstrating a severe business failure.

## 2. Run the Solution (State Machine Checkpoints)
This script simulates the same crash, but uses intermediate database checkpoints to track progress.

```bash
npx ts-node src/19-lease-dirtiness/solution/index.ts
```

**Expected Output:**
You will see Worker B pick up the job, notice the state is `PAYMENT_DONE`, skip the billing phase, and successfully finish the shipping phase. The final counts will be exactly 1 charge and 1 shipment.
